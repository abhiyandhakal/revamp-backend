import { eq } from "drizzle-orm";
import db from "../../db";
import { comment } from "../../db/schema/comment";
import { journal } from "../../db/schema/journal";
import { Journal, Comment } from "../../generated/graphql";

export const getCommentsOfJournal = async (journalId: number | string): Promise<Comment[]> => {
	const commentsFromDb = await db.select().from(comment).where(eq(comment.journalId, +journalId));

	const comments: Comment[] = await Promise.all(
		commentsFromDb.map(async singleComment => {
			return {
				...singleComment,
				authorId: singleComment.userId,
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
