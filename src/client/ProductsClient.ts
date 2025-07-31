import { PRODUCTS_API, USED_PRODUCT_API } from "@/constants";
import type { IResponse, IProduct, IProductOption } from "@/interfaces";
import { GET, POST, PUT } from ".";

const getProductById = async ({ id }: { id: string }) => {
	const url = PRODUCTS_API.DETAIL;
	return GET({ url, isAuth: true, params: { id } });
};

const getProductsByCategoryID = async ({
	categoryId,
}: {
	categoryId: string;
}): Promise<IResponse<IProduct>> => {
	const url = PRODUCTS_API.ALL_DETAIL;
	return GET({ url, isAuth: true, params: { categoryId } });
};

const postUsedProduct = async ({ data }: { data: any }) => {
	const url = USED_PRODUCT_API.POSTING;
	const body = {
		...data,
	};

	return POST({ url, body, isAuth: true });
};

const getAllUsedProduct = async ({ signal }: { signal: AbortSignal }) => {
	const url = USED_PRODUCT_API.GET_ALL;
	return GET({ url, isAuth: true, signal });
};

const getAllProducts = async ({ signal }: { signal: AbortSignal }) => {
	const url = PRODUCTS_API.ALL_PRODUCT;
	return GET({ url, isAuth: true, signal });
};

const deleteProduct = async ({
	body,
	signal,
}: {
	body: { productId: string };
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.DELETE_PRODUCT;
	return POST({ url, body, isAuth: true, signal });
};

const postNewProduct = async ({
	body,
	signal,
}: {
	body: IProduct;
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.NEW_PRODUCT;
	return POST({ url, body, isAuth: true, signal });
};

const putUpdateProduct = async ({
	body,
	signal,
}: {
	body: IProduct;
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.UPDATE_PRODUCT;
	return PUT({ url, body, isAuth: true, signal });
};

const getAllProductsByCategory = async ({
	params,
	signal,
}: {
	params: { categoryId: string };
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.ALL_PRODUCTS_BY_CATEGORY;
	return GET({ url, params, isAuth: true, signal });
};

export default {
	getProductById,
	getProductsByCategoryID,
	postUsedProduct,
	getAllUsedProduct,
	getAllProducts,
	deleteProduct,
	postNewProduct,
	putUpdateProduct,
	getAllProductsByCategory,
};
