import { CATEGORY_API } from "@/constants";
import type {
	IResponse,
	ICategory,
	EnumSaleStatus,
	EnumCategoryType,
} from "@/interfaces";
import { GET, POST, PUT } from ".";

const getAllCategory = async ({
	ctx,
	params,
	signal,
	isAuth = true,
}: {
	ctx?: any;
	params?: {
		status: EnumSaleStatus;
		isValid?: boolean;
	};
	signal?: AbortSignal;
	isAuth?: boolean;
}): Promise<IResponse<ICategory>> => {
	const url = CATEGORY_API.ALL_CATEGORY;
	return GET({ url, params, isAuth, signal, ctx });
};

const getAllValidCategory = async ({
	ctx,
	params,
	signal,
	isAuth = false,
}: {
	ctx?: any;
	params?: any;
	signal?: AbortSignal; // eslint-disable-line
	isAuth?: boolean;
}): Promise<IResponse<ICategory>> => {
	const url = CATEGORY_API.ALL_VALID_CATEGORY;
	return GET({ url, params, isAuth, signal, ctx });
};

const getCategoryById = async ({
	id,
}: {
	id: string;
}): Promise<IResponse<ICategory>> => {
	const url = CATEGORY_API.DETAIL + `/${id}`;
	return GET({ url, isAuth: false });
};

const getCategoriesByIds = async (
	ids: string[]
): Promise<IResponse<ICategory>> => {
	const url = CATEGORY_API.ALL_CATEGORIES_BY_IDS;
	const body = {
		ids,
	};
	return POST({ url, body, isAuth: false });
};

const postCreateCategory = async ({
	body,
	signal,
}: {
	body: ICategory; // eslint-disable-line
	signal?: AbortSignal;
}): Promise<IResponse<ICategory>> => {
	const url = CATEGORY_API.CREATE;
	return POST({ url, body, isAuth: true, signal });
};

const postUpdateCategory = async ({
	body,
	signal,
}: {
	body: ICategory; // eslint-disable-line
	signal?: AbortSignal;
}): Promise<IResponse<ICategory>> => {
	const url = CATEGORY_API.UPDATE;
	return PUT({ url, body, isAuth: true, signal });
};

export default {
	getAllCategory,
	getCategoryById,
	getCategoriesByIds,
	getAllValidCategory,
	postCreateCategory,
	postUpdateCategory,
};
