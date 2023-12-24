import { eq } from "drizzle-orm";
import db from "../../db";
import { comment } from "../../db/schema/comment";
import { journal } from "../../db/schema/journal";
import { Journal, Comment } from "../../generated/graphql";
import { user } from "../../db/schema/user";

export const getCommentsOfJournal = async (journalId: number): Promise<Comment[]> => {
	const commentsFromDb = await db.select().from(comment).where(eq(comment.journalId, journalId));

	const comments: Comment[] = await Promise.all(
		commentsFromDb.map(async singleComment => {
			const authorInDb = await db.select().from(user).where(eq(user.userId, singleComment.userId));
			if (authorInDb.length === 0) throw new Error("Author not found");

			return {
				...singleComment,
				author: { ...authorInDb[0], id: authorInDb[0].userId },
			};
		}),
	);

	return comments;
};

export const getJournals = async (userId: string): Promise<Journal[]> => {
	const journalsFromDb = await db.select().from(journal).where(eq(journal.userId, userId));
	if (journalsFromDb.length === 0) throw new Error("No journals found");

	const journals: Journal[] = await Promise.all(
		journalsFromDb.map(async singleJournal => {
			const comments = await getCommentsOfJournal(singleJournal.journalId);

			return {
				...singleJournal,
				comments,
				likedBy: [],
				sharedBy: [],
			};
		}),
	);

	return journals;
};
