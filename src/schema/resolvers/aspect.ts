import { eq } from "drizzle-orm";
import db from "../../db";
import { aspect } from "../../db/schema/aspect";
import { tag } from "../../db/schema/tag";
import { Aspect } from "../../generated/graphql";
import { userAspect } from "../../db/schema/relations/user-aspect";

export const getAllAspects = async (): Promise<Aspect[]> => {
	const aspects = await db.select().from(aspect);

	const aspectsWithTags: Aspect[] = await Promise.all(
		aspects.map(async singleAspect => {
			const tags = await db.select().from(tag).where(eq(tag.aspectId, singleAspect.aspectId));

			return {
				...singleAspect,
				tags: tags.map(singleTag => ({ tag: singleTag.tag, tagId: singleTag.tagId })),
			};
		}),
	);

	return aspectsWithTags;
};

export const getAspectsOfUser = async (userId: string): Promise<Aspect[]> => {
	const aspects = await db
		.select()
		.from(aspect)
		.innerJoin(userAspect, eq(aspect.aspectId, userAspect.aspectId))
		.where(eq(userAspect.userId, userId));

	const aspectsWithTags: Aspect[] = await Promise.all(
		aspects.map(async singleAspect => {
			const tags = await db
				.select()
				.from(tag)
				.where(eq(tag.aspectId, singleAspect.aspect.aspectId));

			return {
				...singleAspect.aspect,
				tags: tags.map(singleTag => ({ tag: singleTag.tag, tagId: singleTag.tagId })),
			};
		}),
	);

	return aspectsWithTags;
};
