import AuthClient from "client/AuthClient";
import { getFirst, isValid } from "client/index";

const wrapInfo = (info) => ({
	...info,
	isActive: info.status === "ACTIVE",
	isQuest: info.level === "LEVEL_GUEST",
	createdTime: null,
	lastUpdatedTime: null,
});

export const getAccount = async (ctx, retry = 0) => {
	let userRes = null;
	// if (ctx) {
	//   // userRes = await AuthClient.getUserWithContext(ctx, retry);
	//   userRes = await AuthClient.getAccountInfo({ ctx });
	// } else {
	//   // userRes = await AuthClient.getUser(retry);
	//   userRes = await AuthClient.getAccountInfo();
	// }
	userRes = await AuthClient.getAccountInfo();
	if (!isValid(userRes)) {
		return userRes;
	}
	const info = getFirst(userRes);

	const wrapData = wrapInfo(info);
	// change data
	return {
		...userRes,
		data: [wrapData],
	};
};

// get core account
export const getAccountInfo = async ({ ctx }) =>
	AuthClient.getAccountInfo({ ctx });

export const getAccountSessionToken = async ({ ctx }) => {
	const rest = await getAccountInfo({ ctx });
	if (!isValid(rest)) {
		return null;
	}
	const data = getFirst(rest);
	return data.session?.token || null;
};

export default { getAccount, getAccountSessionToken, getAccountInfo };
