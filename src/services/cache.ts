import redis from "@/utils/cache";
import CategoryClient from "@/client/CategoryClient";

const CATEGORY_VALID_KEY = "ALL_VALID_CATEGORY";
const CACHE_TTL = 60 * 60 * 6; // 6 hours

export async function getAllValidCategoriesCached() {
	const cachedData = await redis.get(CATEGORY_VALID_KEY);
	if (cachedData) {
		return JSON.parse(cachedData);
	}
	const response = await CategoryClient.getAllCategory({});
	await redis.set(
		CATEGORY_VALID_KEY,
		JSON.stringify(response),
		"EX",
		CACHE_TTL
	);
	return response;
}
