import { PRODUCT_OPTIONS_API } from "@/constants";
import type { IResponse, IProductOption } from "@/interfaces";
import { EnumProductType } from "@/interfaces";
import { POST, PUT } from ".";

const getProductOptions = async ({
	body,
	signal,
}: {
	body?: {
		productId: string;
		productPart: EnumProductType;
		productOptionIds: string[];
	};
	signal: AbortSignal;
}): Promise<IResponse<IProductOption>> => {
	const url = PRODUCT_OPTIONS_API.GET;
	return POST({ url, body, isAuth: true, signal });
};

const postDeleteProductOption = async ({
	body,
	signal,
}: {
	body: {
		productOptionId: string;
	};
	signal: AbortSignal;
}) => {
	const url = PRODUCT_OPTIONS_API.DELETE;
	return POST({ url, body, isAuth: true, signal });
};

const postNewProductOption = async ({
	body,
	signal,
}: {
	body: IProductOption;
	signal: AbortSignal;
}) => {
	const url = PRODUCT_OPTIONS_API.CREATE;
	return POST({ url, body, isAuth: true, signal });
};

const putUpdateProductOption = async ({
	body,
	signal,
}: {
	body: IProductOption;
	signal: AbortSignal;
}) => {
	const url = PRODUCT_OPTIONS_API.UPDATE;
	return PUT({ url, body, isAuth: true, signal });
};

export default {
	getProductOptions,
	postDeleteProductOption,
	postNewProductOption,
	putUpdateProductOption,
};
