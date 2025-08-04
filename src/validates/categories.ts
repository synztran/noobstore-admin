import { EnumProductType } from "@/interfaces";
import * as yup from "yup";

export const categoryValidationSchema = yup.object({
	categoryName: yup.string().required("Category name is required"),
	description: yup.string().required("Description is required"),
	isActive: yup.boolean().required("Active status is required"),
	minPrice: yup
		.number()
		.required("Minimum price is required")
		.min(0, "Minimum price must be greater than or equal to 0"),
	maxPrice: yup
		.number()
		.test(
			"is-greater-than-min",
			"Maximum price must be greater than minimum price",
			function (value) {
				if (value === 0) return true;
				return value === undefined || value > this.parent.minPrice;
			}
		),
});

export const productValidationSchema = yup.object({
	productName: yup.string().required("Product name is required"),
	isActive: yup.boolean().required("Active status is required"),
	description: yup.string().required("description is required"),
	basePrice: yup
		.number()
		.required("Base price is required")
		.min(0, "Base price must be greater than or equal to 0"),
	salePrice: yup
		.number()
		.typeError("Giá khuyến mãi phải là số")
		.test(
			"is-less-than-price",
			"Giá khuyến mãi không được lớn hơn giá bán",
			function (value) {
				return value === undefined || value <= this.parent.basePrice;
			}
		),
	productPart: yup
		.string()
		.required("Product part is required")
		.oneOf(Object.values(EnumProductType), "Invalid product part"),
	// thumbnail: yup.object({
	// path: yup.string().required("Thumbnail path is required"),
	// size: yup
	// 	.number()
	// 	.required("Thumbnail size is required")
	// 	.min(1, "Thumbnail size must be greater than 0"),
	// }),
	quantity: yup.number().required("Quantity is required"),
});
