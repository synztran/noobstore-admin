export enum EnumCategoryType {
	TBA = "TBA",
	KEYBOARD = "KEYBOARD",
	SWITCH = "SWITCH",
	KEYCAP = "KEYCAP",
	ACCESSORY = "ACCESSORY",
}

export enum EnumProductType {
	CASE = "CASE",
	PLATE = "PLATE",
	PCB = "PCB",
	ACCESSORIES = "ACCESSORIES",
	KEYCAP = "KEYCAP",
	SWITCH = "SWITCH",
	ARTISAN = "ARTISAN",
	FULL_KIT = "FULL_KIT",
	ETC = "",
}

export enum EnumSaleStatus {
	OUTSTOCK = "OUTSTOCK",
	INSTOCK = "INSTOCK",
	GB = "GB",
	TBD = "TBD",
	ALL = "",
}

export enum EnumUsedProductStatus {
	AVAILABLE = "AVAILABLE",
	SOLD = "SOLD",
}

export enum EnumSaleType {
	NORMAL = 0,
	SALE = 1,
	PRE_ORDER = 2,
}

export enum EnumProductOptStatus {
	OUTSTOCK = "OUTSTOCK",
	INSTOCK = "INSTOCK",
}

export enum EnumPostPriceType {
	ABSOLUTE = "ABSOLUTE",
	OBO = "OBO",
}

export enum EnumPaymentMethod {
	CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
	MOMO = "MOMO",
	// ZALO_PAY = "ZALO_PAY",
	BANK_TRANSFER = "BANK_TRANSFER",
	NOT_FOUND = "",
}

export enum EnumServiceType {
	KEYBOARD = "KEYBOARD",
	SWITCHES = "SWITCH",
	OTHER = "OTHER",
}

export enum EnumSwitchType {
	UNKNOWN = "UNKNOWN",
	LINEAR = "LINEAR",
	TACTILE = "TACTILE",
	CLICKY = "CLICKY",
}

export enum EnumCategorySaleType {
	ABSOLUTE = "ABSOLUTE",
	PERCENT = "PERCENT",
	NONE = "NONE",
}

export enum EnumPaymentStaus {
	PAID = "PAID",
	PENDING = "PENDING",
	CANCELLED = "CANCELLED",
}

export enum EnumOrderStatus {
	ORDERED = "ORDERED",
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export enum ENUM_SWITCH_TYPE {
	"LINEAR" = 0,
	"TACTILE" = 1,
	"CLICKY" = 2,
	"UNKNOWN" = 3,
}

export enum ENUM_STABILIZER_LAYOUT {
	"7U" = 1,
	"6.25U" = 2,
}

export enum ENUM_SPRING_TYPE {
	"TX" = 0,
	"UNKNOWN" = 1,
}

export enum EnumUploadStatus {
	UPLOADING = "Uploading",
	DONE = "Uploaded",
	ERROR = "error",
}

export enum ENUM_GREASE_TYPE {
	"KRYTOX" = 0,
	"TRIBOSYS" = 1,
	"UNKNOWN" = 2,
}

export enum ENUM_FILM_TYPE {
	"TX" = 0,
	"UNKNOWN" = 1,
}

export interface IResponse<T> {
	message: string;
	status: string;
	code: number;
	data?: T[];
	errorCode?: string;
}

export interface IRequest {
	url: string;
	params?: any;
	method?: string;
	body?: any;
	mock?: boolean;
	page?: boolean;
	isAuth?: boolean;
	ctx?: any;
	isBasic?: boolean;
	debug?: boolean;
	cache?: boolean;
	timeout?: number | null;
	priority?: number | null;
	retry?: number;
	contentType?: string;
	signal?: AbortSignal;
}

export interface IPostRegisterData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface IPostLogin {
	email: string;
	password: string;
}

export interface IPostVerifyMail {
	token: string;
}

export interface IAuthUser {
	accountId: number;
	avatar: string;
	cartId: string;
	createdAt: string; // ISO date string
	customerId: number;
	email: string;
	fbUrl: string;
	firstName: string;
	getNoti: boolean;
	lastName: string;
	paypal: string;
	phoneAreaCode: string;
	phoneNumber: string;
	shippingAt: unknown; // Assuming shippingAt is an array of any type
	verified: boolean;
	verifiedAt: string; // Assuming this is also a string
	role?: string; // "admin" | "user"
}

export interface IAuthUserInfo {
	bearerToken: string;
	expiresIn: number;
	tokenType: string;
}

export interface ICategory {
	categoryId?: string;
	slug?: string;
	categoryName: string;
	author?: string;
	manufacturing?: string;
	proxyHost?: string;
	status: EnumSaleStatus;
	type: EnumCategoryType;
	dateStart?: string;
	dateEnd?: string;
	datePayment?: string;
	minPrice: number;
	maxPrice: number;
	tax: number;
	handle: number;
	// specs?: string;
	thumbnail: {
		path: string;
		size: number;
	};
	productBelong?: string;
	images?: {
		path: string;
		id: number;
	}[];
	saleType: EnumCategorySaleType;
	isActive: boolean;
	description: string;
	collapseContent?: ICollapseContent[];
	salePrice?: number;
	content: string;
	// not save into db
	isValidSetup?: boolean;
}

export interface ICollapseContent {
	title: string;
	content: string;
}

export interface IProduct {
	productId?: string;
	productName: string;
	replaceProductName: string;
	categoryId: string;
	slug: string;
	productPart: EnumProductType;
	status: EnumSaleStatus;
	price: number;
	salePrice: number;
	thumbnail: {
		path: string;
		size: number;
	};
	images: {
		path: string;
		size: number;
	}[];
	quantity: number;
	isActive: boolean;
	optionGroups: IOptionGroup;
	description?: string;
	isRequired?: boolean;
	isMultiple?: boolean;
	productOpts?: IProductOption[];
}

export interface IOptionGroup {
	groupName: string;
	isRequired: boolean;
	isMultiple: boolean;
	optionIds: string[];
}

export interface IProductOption {
	id?: string; // Assuming PyObjectId is a string representation
	name?: string;
	price?: number;
	salePrice?: number;
	description?: string;
	status?: EnumProductOptStatus; // Assuming ENUM_STATUS maps to EnumProductOptStatus
	quantity?: number;
	thumbnail?: string;
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date | null;
	productPart?: EnumProductType;
}

export interface IProductOption {
	id?: string; // Assuming PyObjectId is a string representation
	name?: string;
	price?: number;
	salePrice?: number;
	description?: string;
	status?: EnumProductOptStatus; // Assuming ENUM_STATUS maps to EnumProductOptStatus
	quantity?: number;
	thumbnail?: string;
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date | null;
	productPart?: EnumProductType;
}
