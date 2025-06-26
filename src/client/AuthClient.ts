import type {
	IPostLogin,
	IPostRegisterData,
	IPostVerifyMail,
} from "@/interfaces";
import { ACCOUNT_API, AUTH_API } from "@/constants";
import { GET, POST } from "./index";

export const postRegister = async (data: IPostRegisterData) => {
	const url = AUTH_API.REGISTER;
	return POST({ url, body: data, isAuth: false });
};

export const postLogin = async (data: IPostLogin) => {
	const url = AUTH_API.LOGIN;
	const body = {
		email: data.email,
		password: data.password,
	};
	return POST({ url, body, isAuth: false });
};

export const getAccountInfo = async ({ ctx }: { ctx?: unknown }) =>
	GET({ ctx, url: ACCOUNT_API.CURRENT_ACCOUNT });

export const postVerifyMail = async (data: IPostVerifyMail) =>
	POST({ url: AUTH_API.VERIFY_EMAIL, body: data, isAuth: false });

export default {
	postRegister,
	postLogin,
	getAccountInfo,
	postVerifyMail,
};
