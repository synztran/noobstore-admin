import React from "react";
import {
	EnumCategoryType,
	EnumProductOptStatus,
	EnumProductType,
	EnumSaleStatus,
	EnumUploadStatus,
} from "./interfaces";
import { CircleCheck, CircleX } from "lucide-react";

export const PAGE_LINK = {
	HOME: "/",
	DASHBOARD: "/dashboard",
	LOGIN: "/login",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	VERIFY_EMAIL: "/verify-email",
	VERIFY_OTP: "/verify-otp",
};

const DOMAIN_PREFIX = "http://127.0.0.1:8000"; // when you try fetching data ssr should using this domain, try using local will cat error on connector port

const CATEGORY_PREFIX = `${DOMAIN_PREFIX}/category`;
const PRODUCT_PREFIX = `${DOMAIN_PREFIX}/product`;
const ACCOUNT_PREFIX = `${DOMAIN_PREFIX}/account`;
const UPLOAD_PREFIX = `${DOMAIN_PREFIX}/upload`;
const USED_PRODUCT_PREFIX = `${DOMAIN_PREFIX}/used-product`;
const PRODUCT_OPTION_PREFIX = `${DOMAIN_PREFIX}/product-option`;
const CONFIG_PREFIX = `${DOMAIN_PREFIX}/config`;

export const CATEGORY_API = {
	ALL_CATEGORY: `${CATEGORY_PREFIX}/get-all`,
	ALL_VALID_CATEGORY: `${CATEGORY_PREFIX}/get-all-valid`,
	DETAIL: `${CATEGORY_PREFIX}`, // {id}
	ALL_CATEGORIES_BY_IDS: `${CATEGORY_PREFIX}/getCategoriesByIds`, // {ids}
	CREATE: `${CATEGORY_PREFIX}/add`,
	UPDATE: `${CATEGORY_PREFIX}/update`,
};

export const PRODUCTS_API = {
	ALL_PRODUCT: `${PRODUCT_PREFIX}/get-all`,
	DETAIL: `${PRODUCT_PREFIX}`, // {product_id}
	ALL_DETAIL: `${PRODUCT_PREFIX}/all`, // {category_id}
	PRODUCT_BY_PARAMS: `${PRODUCT_PREFIX}/get-by-params`, // {product_id, option_id}
	DELETE_PRODUCT: `${PRODUCT_PREFIX}/delete`, // {product_id}
	NEW_PRODUCT: `${PRODUCT_PREFIX}/create`, // {product_id, option_name}
	UPDATE_PRODUCT: `${PRODUCT_PREFIX}/update`, // {product_id}
	ALL_PRODUCTS_BY_CATEGORY: `${PRODUCT_PREFIX}/all-products-by-category`, // {category_id}
};

export const PRODUCT_OPTIONS_API = {
	GET: `${PRODUCT_OPTION_PREFIX}/get`, // {product_id, option_name}
	CREATE: `${PRODUCT_OPTION_PREFIX}/create`, // {product_id, option_name}
	DELETE: `${PRODUCT_OPTION_PREFIX}/delete`, // {product_id, option_id}
};

export const ACCOUNT_API = {
	ACCOUNT: `${ACCOUNT_PREFIX}`,
	CURRENT_ACCOUNT: `${ACCOUNT_PREFIX}/get-user`,
};

export const AUTH_API = {
	REFRESH: `${DOMAIN_PREFIX}/auth/refresh`,
	LOGOUT: `${DOMAIN_PREFIX}/auth/logout`,
	LOGIN: `${DOMAIN_PREFIX}/auth/login`,
	REGISTER: `${DOMAIN_PREFIX}/auth/register`,
	VERIFY_EMAIL: `${DOMAIN_PREFIX}/auth/verify`,
};

export const CART_API = {
	GET_CART: `${DOMAIN_PREFIX}/cart`,
	ADD_CART: `${DOMAIN_PREFIX}/cart`,
	UPDATE_CART: `${DOMAIN_PREFIX}/cart`,
	REMOVE_ITEM_CART: `${DOMAIN_PREFIX}/cart/remove-item`,
	UPDATE_CART_PRODUCT: `${DOMAIN_PREFIX}/cart/update-cart-product`,
};

export const CHECKOUT_API = {
	CHECKOUT: `${DOMAIN_PREFIX}/order/checkout`,
	ORDER_DETAIL: `${DOMAIN_PREFIX}/order`, // {order_id}
};

export const PROMOTION_API = {
	LUCKY_WHEEL: `${DOMAIN_PREFIX}/promotion/lucky-wheel/get`,
};

export const CONFIG_API = {
	GET: `${CONFIG_PREFIX}/get`,
	ADD_PRODUCT_OPTION: `${CONFIG_PREFIX}/product-option/add`,
};

export const UPLOAD_API = {
	IMAGE: `${UPLOAD_PREFIX}/image`,
};

export const USED_PRODUCT_API = {
	POSTING: `${USED_PRODUCT_PREFIX}/post`,
	GET_ALL: `${USED_PRODUCT_PREFIX}`,
};

export const HTTP_STATUS = {
	Ok: "OK",
	Error: "ERROR",
	Invalid: "INVALID",
	NotFound: "NOT_FOUND",
	Forbidden: "FORBIDDEN",
	Existed: "EXISTED",
	Unauthorized: "UNAUTHORIZED",
};

export const MapCategoryStatus: Record<
	EnumSaleStatus,
	{
		label: string;
		color: string;
	}
> = {
	[EnumSaleStatus.GB]: {
		label: "Group buy",
		color: "bg-blue-500",
	},
	[EnumSaleStatus.INSTOCK]: {
		label: "Sẵn hàng",
		color: "bg-green-500",
	},
	[EnumSaleStatus.OUTSTOCK]: {
		label: "Hết hàng",
		color: "bg-red-500",
	},
	[EnumSaleStatus.TBD]: {
		label: "",
		color: "",
	},
	[EnumSaleStatus.ALL]: {
		label: "",
		color: "",
	},
};

export const RCategoryType: Record<EnumCategoryType, string> = {
	[EnumCategoryType.ACCESSORY]: "Phụ kiện",
	[EnumCategoryType.KEYCAP]: "Keycap",
	[EnumCategoryType.SWITCH]: "Switch",
	[EnumCategoryType.KEYBOARD]: "Bàn phím",
	[EnumCategoryType.TBA]: "Khác",
};

export const UploadStatusProperty: Record<
	EnumUploadStatus,
	{ color: string; text: string; icon?: React.ReactElement }
> = {
	[EnumUploadStatus.UPLOADING]: {
		color: "text-gray-500",
		text: "Đang tải lên...",
	},
	[EnumUploadStatus.DONE]: {
		color: "text-green-500",
		text: "Hoàn thành",
		icon: React.createElement(CircleCheck, {
			className: "text-green-500",
			size: 18,
		}),
	},
	[EnumUploadStatus.ERROR]: {
		color: "text-red-500",
		text: "Không thể tải lên",
		icon: React.createElement(CircleX, {
			className: "text-red-500",
			size: 18,
		}),
	},
};

export const RProductPartType: Record<
	EnumProductType,
	{
		label: string;
		value: EnumProductType;
		disabled?: boolean;
	}
> = {
	[EnumProductType.CASE]: {
		label: "Case",
		value: EnumProductType.CASE,
	},
	[EnumProductType.PCB]: {
		label: "Mạch phím",
		value: EnumProductType.PCB,
	},
	[EnumProductType.PLATE]: {
		label: "Plate",
		value: EnumProductType.PLATE,
	},
	[EnumProductType.ACCESSORIES]: {
		label: "Phụ kiện",
		value: EnumProductType.ACCESSORIES,
	},
	[EnumProductType.KEYCAP]: {
		label: "Keycap",
		value: EnumProductType.KEYCAP,
	},
	[EnumProductType.SWITCH]: {
		label: "Switch",
		value: EnumProductType.SWITCH,
	},
	[EnumProductType.ARTISAN]: {
		label: "Artisan",
		value: EnumProductType.ARTISAN,
	},
	[EnumProductType.ETC]: {
		label: "Khác",
		value: EnumProductType.ETC,
	},
	[EnumProductType.FULL_KIT]: {
		label: "Full kit",
		value: EnumProductType.FULL_KIT,
	},
	[EnumProductType.LAYOUT]: {
		label: "Layout",
		value: EnumProductType.LAYOUT,
	},
	[EnumProductType.VERSION]: {
		label: "Version",
		value: EnumProductType.VERSION,
	},
	[EnumProductType.SIZE]: {
		label: "Size",
		value: EnumProductType.SIZE,
	},
};

export const productPartOptions = [
	{
		label: RProductPartType[EnumProductType.CASE].label,
		value: EnumProductType.CASE,
	},
	{
		label: RProductPartType[EnumProductType.PCB].label,
		value: EnumProductType.PCB,
	},
	{
		label: RProductPartType[EnumProductType.PLATE].label,
		value: EnumProductType.PLATE,
	},
	{
		label: RProductPartType[EnumProductType.ACCESSORIES].label,
		value: EnumProductType.ACCESSORIES,
	},
	{
		label: RProductPartType[EnumProductType.KEYCAP].label,
		value: EnumProductType.KEYCAP,
	},
	{
		label: RProductPartType[EnumProductType.SWITCH].label,
		value: EnumProductType.SWITCH,
	},
	{
		label: RProductPartType[EnumProductType.ARTISAN].label,
		value: EnumProductType.ARTISAN,
	},
	{
		label: RProductPartType[EnumProductType.LAYOUT].label,
		value: EnumProductType.LAYOUT,
	},
	{
		label: RProductPartType[EnumProductType.VERSION].label,
		value: EnumProductType.VERSION,
	},
	{
		label: RProductPartType[EnumProductType.SIZE].label,
		value: EnumProductType.SIZE,
	},
	{
		label: RProductPartType[EnumProductType.ETC].label,
		value: EnumProductType.ETC,
	},
];

export const ProductOptStatus: Record<
	EnumProductOptStatus,
	{
		label: string;
		value: EnumProductOptStatus;
	}
> = {
	[EnumProductOptStatus.INSTOCK]: {
		label: "Còn hàng",
		value: EnumProductOptStatus.INSTOCK,
	},
	[EnumProductOptStatus.OUTSTOCK]: {
		label: "Hết hàng",
		value: EnumProductOptStatus.OUTSTOCK,
	},
};
