const CookiesParser = (cookies: any) => {
	return cookies.split(";").reduce((res: any, c: any) => {
		const i = c.indexOf("=");
		const key = c.substr(0, i).trim();
		const val = c.substr(i + 1).trim();
		try {
			return Object.assign(res, { [key]: JSON.parse(val) });
		} catch (err) {
			return Object.assign(res, { [key]: val });
		}
	}, {});
};

const getCookieFromCtx = (
	ctx: any,
	nameCookie: string,
	isURLDecoded = false
) => {
	const cookies = ctx?.req?.headers?.cookie || null;
	if (!cookies || cookies == null) {
		return null;
	}
	const CookiesCtx = CookiesParser(cookies);
	return isURLDecoded
		? decodeURIComponent(CookiesCtx[nameCookie])
		: CookiesCtx[nameCookie];
};

export default { getCookieFromCtx, CookiesParser };
