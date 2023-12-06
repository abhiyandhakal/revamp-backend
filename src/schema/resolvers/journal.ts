import { eq } from "drizzle-orm";
import db from "../../db";
import { comment } from "../../db/schema/comment";
import { journal } from "../../db/schema/journal";
import { Journal, Comment, UserWithLessDetails, JournalLike } from "../../generated/graphql";
import { user } from "../../db/schema/user";
import { userLikesJournal } from "../../db/schema/relations/user-likes-journal";

const getCommentsOfJournal = async (journalId: number): Promise<Comment[]> => {
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

const getJournalLikes = async (journalId: number): Promise<JournalLike[]> => {
	const likesFromDb = await db
		.select()
		.from(userLikesJournal)
		.where(eq(userLikesJournal.journalId, journalId));

	const likes: JournalLike[] = await Promise.all(
		likesFromDb.map(async singleLike => {
			const userFromDb = await db.select().from(user).where(eq(user.userId, singleLike.userId));
			if (userFromDb.length === 0) throw new Error("User not found");

			return {
				likedBy: { ...userFromDb[0], id: userFromDb[0].userId },
				likedAt: singleLike.likedAt,
			};
		}),
	);

	return likes;
};

export const getJournals = async (userId: string): Promise<Journal[]> => {
	const journalsFromDb = await db.select().from(journal).where(eq(journal.userId, userId));
	if (journalsFromDb.length === 0) throw new Error("No journals found");

	const journals: Journal[] = await Promise.all(
		journalsFromDb.map(async singleJournal => {
			const comments = await getCommentsOfJournal(singleJournal.journalId);
			const likes = await getJournalLikes(singleJournal.journalId);

			return {
				...singleJournal,
				comments,
				likedBy: likes,
				sharedBy: [],
			};
		}),
	);

	return journals;
};
