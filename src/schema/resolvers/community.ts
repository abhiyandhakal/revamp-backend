import { eq } from "drizzle-orm";
import db from "../../db";
import { community } from "../../db/schema/community";
import { userCommunity } from "../../db/schema/relations/user-community";
import { Community, QueryResolvers } from "../../generated/graphql";

export const getAllCommunities: QueryResolvers["communities"] = async () => {
	const gqlCommunities: Community[] = [];
	return gqlCommunities;
};

export const getSingleCommunity: QueryResolvers["community"] = async (_, { communityId }) => {
	const sqlCommunity = await db
		.select()
		.from(community)
		.where(eq(community.communityId, communityId));

	if (sqlCommunity.length === 0) throw new Error("Community does not exist");

	const gqlCommunity = await sqlToGqlCommunity(sqlCommunity[0]);

	return gqlCommunity;
};

async function sqlToGqlCommunity(sqlCommunity: typeof community.$inferSelect): Promise<Community> {
	const communityWithUserArr = await db
		.select()
		.from(community)
		.innerJoin(userCommunity, eq(community.communityId, userCommunity.communityId))
		.where(eq(community.communityId, sqlCommunity.communityId));

	console.log(communityWithUserArr);

	throw new Error("Not implemented");
}
