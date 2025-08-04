import { CONFIG_API } from "@/constants";
import type {
	IResponse,
	IConfigProductOption,
	IConfig,
	EnumProductType,
} from "@/interfaces";
import { GET, POST } from ".";

const getAllConfig = async ({
	ctx,
	signal,
	isAuth = true,
}: {
	ctx?: unknown;
	signal?: AbortSignal;
	isAuth?: boolean;
}): Promise<IResponse<IConfig>> => {
	const url = CONFIG_API.GET;
	return GET({ url, isAuth, signal, ctx });
};

const addProductOption = async ({
	ctx,
	body,
	signal,
	isAuth = true,
}: {
	ctx?: unknown;
	body?: {
		productOptions: IConfigProductOption[];
		updatedAt: Date;
		productId: string;
		productPart: EnumProductType;
	};
	signal?: AbortSignal; // eslint-disable-line
	isAuth?: boolean;
}): Promise<IResponse<IConfigProductOption>> => {
	const url = CONFIG_API.ADD_PRODUCT_OPTION;
	return POST({ url, body, isAuth, signal, ctx });
};
export default {
	getAllConfig,
	addProductOption,
};
