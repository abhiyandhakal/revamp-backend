import { eq } from "drizzle-orm";
import db from "../../db";
import { aspect } from "../../db/schema/aspect";
import { tag } from "../../db/schema/tag";
import { Aspect } from "../../generated/graphql";

export const getAllAspects = async (): Promise<Aspect[]> => {
	const aspects = await db.select().from(aspect);

	const aspectsWithTags: Aspect[] = await Promise.all(
		aspects.map(async singleAspect => {
			const tags = await db.select().from(tag).where(eq(tag.aspectId, singleAspect.aspectId));

			return {
				...singleAspect,
				aspectId: singleAspect.aspectId.toString(),
				tags: tags.map(singleTag => ({ tag: singleTag.tag, tagId: singleTag.tagId.toString() })),
			};
		}),
	);

	return aspectsWithTags;
};
