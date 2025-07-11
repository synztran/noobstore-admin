import TextEditor from "@/components/Texteditor";
import ProductsClient from "@/client/ProductsClient";
import UploadImage from "@/components/InputComponents/UploadImage";
import { productPartOptions } from "@/constants";
import { HTTP_STATUS } from "@/constants";
import {
	EnumProductOptStatus,
	EnumProductType,
	EnumSaleStatus,
} from "@/interfaces";
import type { IProductOption } from "@/interfaces";
import { formatCurrency, formatNumber } from "@/utils/FormatNumber";
// import {
// 	Button,
// 	Dialog,
// 	DialogActions,
// 	DialogContent,
// 	DialogTitle,
// 	Switch,
// 	TextField,
// } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import SelectionList from "../selectionList";
import toast from "react-hot-toast";

interface IProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const NewProductOption: React.FC<IProps> = (props) => {
	const { open, onClose, onSuccess } = props;
	// const { refetch } = useProductOptionsQuery({});
	const validationSchema = yup.object({
		name: yup.string().required("Product name is required"),
		price: yup
			.number()
			.required("price is required")
			.min(0, "price must be greater than or equal to 0"),
		salePrice: yup
			.number()
			.typeError("Giá khuyến mãi phải là số")
			.test(
				"is-less-than-price",
				"Giá khuyến mãi không được lớn hơn giá bán",
				function (value) {
					return value === undefined || value <= this.parent.price;
				}
			),
		description: yup.string().required("Description is required"),
		// thumbnail: yup.string().required("Thumbnail is required"),
		quantity: yup.number().required("Quantity is required"),
		productPart: yup.string().required("Product part is required"),
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			isActive: false,
			price: 0,
			salePrice: 0,
			thumbnail: "",
			description: "",
			quantity: 0,
			productPart: EnumProductType.ETC,
			status: EnumProductOptStatus.INSTOCK,
		} as IProductOption,
		validationSchema,
		onSubmit: async (values) => {
			handleSubmit(values);
		},
	});

	const handleOnChange = (name: string, value: string) => {
		formik.setFieldValue(name, value);
	};

	const syncImageToFormik = (file: { publicUrl: string; size: number }) => {
		formik.setFieldValue("thumbnail", file.publicUrl);
	};

	const handleSubmit = async (values: IProductOption) => {
		const signal = new AbortController().signal;
		const resp = await ProductsClient.postNewProductOption({
			body: {
				...values,
				thumbnail: values.thumbnail ?? "",
			},
			signal,
		});
		if (resp.status === HTTP_STATUS.Ok) {
			toast.success("Tạo mới thành công");
			formik.resetForm();
			onClose();
			onSuccess();
		} else {
			toast.error("Có lỗi xảy ra trong quá trình tạo mới");
		}
	};

	return (
		<dialog className={`modal ${open ? 'modal-open' : ''}`}>
			<div className="modal-box max-w-[60vw]">
				<h3 className="font-bold text-2xl mb-4">
					Tạo mới Product Option
				</h3>
				<form onSubmit={formik.handleSubmit}>
					<div className="space-y-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Tên sản phẩm</span>
							</label>
							<input
								type="text"
								id="name"
								name="name"
								className={`input input-bordered w-full ${
									formik.touched.name && formik.errors.name ? 'input-error' : ''
								}`}
								value={formik.values.name}
								onChange={formik.handleChange}
							/>
							{formik.touched.name && formik.errors.name && (
								<label className="label">
									<span className="label-text-alt text-error">{formik.errors.name}</span>
								</label>
							)}
						</div>

						<SelectionList
							options={productPartOptions}
							name="productPart"
							value={formik.values.productPart || ""}
							placeholder="Lựa chọn loại sản phẩm"
							onChange={handleOnChange}
							className="mt-2"
						/>

						<div className="flex gap-4">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Trạng thái hiện thị</span>
								</label>
								<div className="flex gap-2 items-center">
									<input
										type="checkbox"
										id="isActive"
										name="isActive"
										className="toggle toggle-primary"
										checked={formik.values.isActive}
										onChange={formik.handleChange}
										value={
											formik.values.isActive
												? EnumSaleStatus.INSTOCK
												: EnumSaleStatus.OUTSTOCK
										}
									/>
									<label htmlFor="isActive" className="label-text">
										{formik.values.isActive ? "Bật" : "Tắt"}
									</label>
								</div>
							</div>

							<div className="form-control flex-1">
								<label className="label">
									<span className="label-text">Số lượng tồn</span>
								</label>
								<input
									type="number"
									id="quantity"
									name="quantity"
									className={`input input-bordered w-full ${
										formik.touched.quantity && formik.errors.quantity ? 'input-error' : ''
									}`}
									value={formik.values.quantity}
									onChange={formik.handleChange}
								/>
								{formik.touched.quantity && formik.errors.quantity && (
									<label className="label">
										<span className="label-text-alt text-error">{formik.errors.quantity}</span>
									</label>
								)}
								<span className="text-green-600 text-sm mt-1">
									{formatNumber(formik.values.quantity || 0)}
								</span>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="form-control flex-1">
								<label className="label">
									<span className="label-text">Giá</span>
								</label>
								<input
									type="number"
									id="price"
									name="price"
									className={`input input-bordered w-full ${
										formik.touched.price && formik.errors.price ? 'input-error' : ''
									}`}
									value={formik.values.price}
									onChange={formik.handleChange}
								/>
								{formik.touched.price && formik.errors.price && (
									<label className="label">
										<span className="label-text-alt text-error">{formik.errors.price}</span>
									</label>
								)}
								<span className="text-green-600 text-sm mt-1">
									{formatCurrency(formik.values.price || 0)}
								</span>
							</div>

							<div className="form-control flex-1">
								<label className="label">
									<span className="label-text">Giá khuyến mãi</span>
								</label>
								<input
									type="number"
									id="salePrice"
									name="salePrice"
									className={`input input-bordered w-full ${
										formik.touched.salePrice && formik.errors.salePrice ? 'input-error' : ''
									}`}
									value={formik.values.salePrice}
									onChange={formik.handleChange}
								/>
								{formik.touched.salePrice && formik.errors.salePrice && (
									<label className="label">
										<span className="label-text-alt text-error">{formik.errors.salePrice}</span>
									</label>
								)}
								{!formik.errors.salePrice && (
									<span className="text-green-600 text-sm mt-1">
										{formatCurrency(formik.values.salePrice || 0)}
									</span>
								)}
							</div>
						</div>

						<TextEditor
							label="Nội dung chi tiết"
							value={formik.values.description || ""}
							onChange={(value) =>
								formik.setFieldValue("description", value)
							}
							placeholder="Nội dung chi tiết"
							className="mt-4"
							maxContent={500}
						/>

						<UploadImage
							label="Ảnh sản phẩm đại diện"
							handleSyncData={syncImageToFormik}
						/>
					</div>

					<div className="modal-action">
						<button type="button" className="btn btn-secondary" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary">
							Create
						</button>
					</div>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>close</button>
			</form>
		</dialog>
	);
};

export default NewProductOption;
