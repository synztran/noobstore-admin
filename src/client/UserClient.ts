import { ACCOUNT_API } from "@/constants";
import { GET } from "./index";

const getCurrentUser = async (ctx?: unknown) => {
	const url = ACCOUNT_API.CURRENT_ACCOUNT;
	return GET({ ctx, url });
};

export default {
	getCurrentUser,
};
