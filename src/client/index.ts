import { HTTP_STATUS } from "@/constants";
import { ACCESS_TOKEN, ACCESS_TOKEN_LONGLIVE } from "@/systemConfig";
import type { IRequest, IResponse } from "@/interfaces";
import CookiesParser from "@/utils/CookieParser";
import RequestUtils from "@/utils/RequestUtils";
import { getSessionTokenClient } from "@/utils/SessionUtils";

export const MAX_LIMIT = 50;
export const OFFSET_DEFAULT = 0;
export const LIMIT_DEFAULT = 20;

const mapRequest: Record<string, string> = {};
const mapRequestPromise: Record<string, Promise<Response> | null> = {};

export function isValid<T>(resp: IResponse<T>) {
	return resp &&
		resp &&
		resp.status &&
		resp.status === HTTP_STATUS.Ok &&
		resp.data
		? true
		: false;
}

export function getFirst<T>(resp: IResponse<T>, def = null) {
	return (
		resp &&
		resp.status &&
		resp.status === HTTP_STATUS.Ok &&
		resp.data &&
		resp.data[0]
	);
}

export function getData<T>(resp: IResponse<T>, def = []) {
	return isValid(resp) ? resp.data : def;
}
export function isValidWithoutData<T>(resp: IResponse<T>) {
	return resp && resp.status && resp.status === HTTP_STATUS.Ok;
}

export function getSessionToken(ctx: any) {
	if (
		ctx?.req?.headers?.authorization &&
		ctx?.req?.headers?.isAuthorizationClient
	) {
		return ctx?.req?.headers?.authorization?.split(" ")[1];
	}

	const tk = CookiesParser.getCookieFromCtx(ctx, ACCESS_TOKEN);
	if (tk && tk.length > 0) {
		return tk;
	}

	return CookiesParser.getCookieFromCtx(ctx, ACCESS_TOKEN_LONGLIVE);
}

async function request({
	url,
	params,
	method,
	body,
	mock = false,
	page = false,
	isAuth = true,
	ctx = null,
	isBasic = false,
	debug = false,
	cache = false,
	timeout = null,
	priority = null,
	retry = 0,
	contentType = "application/json",
	signal,
}: IRequest) {
	try {
		const logTime = +new Date();
		const headers: Record<string, string> = {
			"X-Request-Path": url,
			"X-Request-ID": new Date().getTime().toString(),
		};
		const parameters = { ...params };
		let link = url;
		// if (!page && url?.indexOf("http") === -1) {
		// 	link = (mock ? MOCK_API_HOST : API_HOST) + url;
		// }

		let isUseBasic = false;
		if (isAuth) {
			if (ctx) {
				const AuthorizationValue = getSessionToken(ctx);
				if (AuthorizationValue && AuthorizationValue.length > 0) {
					headers["user-agent"] = ctx.req.headers["user-agent"];
					headers.Authorization = `Bearer ${AuthorizationValue}`;
				}
			} else {
				const AuthorizationValue = getSessionTokenClient();
				if (AuthorizationValue && AuthorizationValue.length > 0) {
					headers.Authorization = `Bearer ${AuthorizationValue}`;
				}
			}
			if (
				isBasic &&
				(!headers.Authorization || headers.Authorization.length === 0)
			) {
				// headers.Authorization = BASIC_AUTHEN;
				isUseBasic = true;
				parameters.isBasic = true;
			}

			if (!headers.Authorization || headers.Authorization.length === 0) {
				return {
					errorCode: "MISSING_AUTHORIZATION",
					status: HTTP_STATUS.Unauthorized,
					message: "Missing session",
				};
			}
		} else if (
			isBasic &&
			(!headers.Authorization || headers.Authorization.length === 0)
		) {
			// headers.Authorization = BASIC_AUTHEN;
			isUseBasic = true;
			parameters.isBasic = true;
		}
		if (parameters) {
			// eslint-disable-next-line import/no-named-as-default-member
			const parameterStr =
				RequestUtils.convertObjectToParameter(parameters);
			if (parameterStr.length > 0)
				link += (link?.indexOf("?") >= 0 ? "&" : "?") + parameterStr;
		}
		/*
	  priority
		high: A high priority fetch request relative to other requests of the same type.
		low: A low priority fetch request relative to other requests of the same type.
		auto: Automatically determine the priority of the fetch request relative to other requests of the same type (default).
	  */
		const dataRequest = {
			method,
			credentials: "same-origin" as RequestCredentials,
			headers: {
				...headers,
				// "Content-Type": contentType ?? "application/json", // let browser set it
				"X-Request-Path": url,
				"X-Request-ID": String(new Date().getTime()),
			},
			body: typeof body === "object" ? JSON.stringify(body) : body || {},
			signal: signal,
			// priority: null,
		};

		// Handle body and Content-Type
		if (body instanceof FormData) {
			dataRequest.body = body;
		} else {
			// @ts-ignore
			dataRequest.headers["Content-Type"] = contentType;
			if (typeof body === "object" && body !== null) {
				dataRequest.body = JSON.stringify(body);
			} else {
				dataRequest.body = body as BodyInit | null;
			}
		}

		let id = null;
		// timeout with signal
		if (timeout !== null && timeout > 0) {
			const controller = new AbortController();
			id = setTimeout(() => controller.abort(), timeout);
			// dataRequest.signal = controller.signal;
		}

		// if (priority) {
		// 	dataRequest.priority = priority;
		// }

		const logTimeFetch = +new Date();

		// cache with client side & cache boolean
		if (!ctx && method === "GET" && cache) {
			if (mapRequest[link]) {
				return mapRequest;
			}
			if (!mapRequestPromise[link]) {
				mapRequestPromise[link] = fetch(
					link,
					dataRequest as unknown as RequestInit
				);
			}
		}
		const res = await (mapRequestPromise[link] ||
			fetch(link, dataRequest as unknown as RequestInit));
		const result = await res.json();
		if (timeout != null && timeout > 0 && id) {
			clearTimeout(id);
		}

		if (cache) {
			mapRequest[link] = result;
			mapRequestPromise[link] = null;
			result.cache = true;
		}
		if (isUseBasic) {
			result.isBasic = true;
		}

		if (debug) {
			result.link = link;
			result.method = method;
			result.headers = headers;
			result.body = body;
			result.params = params;
		}

		const timeExcute = +new Date() - logTime;
		const timeFetchAPI = +new Date() - logTimeFetch;
		result.timeExcute = timeExcute;
		result.timeFetchAPI = timeFetchAPI;
		const retryCodes = [408, 500, 502, 503, 504, 522, 524];

		if (retry > 0 && retryCodes.includes(res.status)) {
			return request({
				url,
				params,
				method,
				body,
				mock,
				page,
				isAuth,
				ctx,
				isBasic,
				debug,
				cache,
				timeout,
				priority,
				retry: retry - 1,
			});
		}

		return result;
	} catch (err: any) {
		if (retry === 0)
			return {
				error: err,
				status: HTTP_STATUS.Error,
				data: [],
				message: err?.message || " Hệ thống đã xảy ra lỗi .",
			};

		// retry request
		return request({
			url,
			params,
			method,
			body,
			mock,
			page,
			isAuth,
			ctx,
			isBasic,
			debug,
			cache,
			timeout,
			priority,
			retry: retry - 1,
		});
	}
}

export async function GET(props: IRequest) {
	return request({ ...props, method: "GET" });
}

export async function POST(props: IRequest) {
	return request({ ...props, method: "POST" });
}

export async function PUT(props: IRequest) {
	return request({ ...props, method: "PUT" });
}

export async function DELETE(props: IRequest) {
	return request({ ...props, method: "DELETE" });
}

export default {
	GET,
	POST,
	PUT,
	DELETE,
	isValid,
	getSessionToken,
};
