import { and, eq } from "drizzle-orm";
import db from "../../db";
import { comment } from "../../db/schema/comment";
import { journal } from "../../db/schema/journal";
import { Journal, Comment, JournalLike, QueryResolvers } from "../../generated/graphql";
import { user } from "../../db/schema/user";
import { userLikesJournal } from "../../db/schema/relations/user-likes-journal";
import { YogaInitialContext } from "graphql-yoga";
import { getSession } from "../../middlewares/permissions";
import { workedOnLog } from "../../db/schema/worked-on-log";
import { checkIfToday, checkIfYesterday } from "../../lib/check-date";
import { dailyJournal } from "../../template/daily-journal";

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

export const sqlToGqlJournal = async (
	singleJournal: typeof journal.$inferSelect,
): Promise<Journal> => {
	const comments = await getCommentsOfJournal(singleJournal.journalId);
	const likes = await getJournalLikes(singleJournal.journalId);

	return {
		...singleJournal,
		access: singleJournal.access || "private",
		comments,
		likedBy: likes,
		sharedBy: [],
	};
};

export const getSingleJournal: QueryResolvers["getSingleJournal"] = async (
	_,
	{ journalId },
	ctx: YogaInitialContext,
) => {
	const journalFromDb = await db.select().from(journal).where(eq(journal.journalId, journalId));
	if (journalFromDb.length === 0) throw new Error("Journal not found");
	const session = await getSession(ctx.request.headers);

	if (session.userId !== journalFromDb[0].userId) throw new Error("Journal not found");

	return sqlToGqlJournal(journalFromDb[0]);
};

export const getJournalsOfUser: QueryResolvers["getJournalsOfUser"] = async (_, { userId }) => {
	const journalsFromDb = await db.select().from(journal).where(eq(journal.userId, userId));
	if (journalsFromDb.length === 0) throw new Error("No journals found");

	const journals: Journal[] = await Promise.all(
		journalsFromDb.map(async singleJournal => sqlToGqlJournal(singleJournal)),
	);

	return journals;
};

export const createOrUpdateJournalAutomated = async (userId: string, goalId: number) => {
	const workedOns = await db.select().from(workedOnLog).where(eq(workedOnLog.goalId, goalId));

	const workedOnToday = workedOns.filter(workedOn => checkIfToday(workedOn.date));
	const workedOnYesterday = workedOns.filter(workedOn => checkIfYesterday(workedOn.date));

	const journalText = await dailyJournal(userId, workedOnYesterday.length, workedOnToday.length);

	const todayJournal = await db
		.select()
		.from(journal)
		.where(and(eq(journal.userId, userId), eq(journal.date, new Date())));

	if (todayJournal.length === 0) {
		await db.insert(journal).values({
			title: `Journal for ${new Date().toLocaleDateString()}`,
			userId,
			date: new Date(),
			type: "daily",
			content: journalText,
		});
	}
};
