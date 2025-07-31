import TextEditor from "@/components/Texteditor";
import UploadImage from "@/components/InputComponents/UploadImage";
import { HTTP_STATUS, productPartOptions } from "@/constants";
import {
	EnumProductOptStatus,
	EnumProductType,
	EnumSaleStatus,
} from "@/interfaces";
import type { IConfigProductOption, IProductOption } from "@/interfaces";
import { formatCurrency, formatNumber } from "@/utils/FormatNumber";
import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import ProductSelector from "../ProductSelector";
import SelectionList from "../selectionList";
import ProductOptionsClient from "@/client/ProductOptionsClient";
import { X } from "lucide-react";
import { type IOptionSelection } from "@/components/InputComponents/SelectWithAdd";
import OptionSelector from "../OptionSelector";
import ConfigClient from "@/client/ConfigClient";

interface IProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	productOption?: IProductOption;
	isEdit?: boolean;
}

const getDefaultOption = (): IProductOption => ({
	name: "",
	isActive: false,
	price: 0,
	salePrice: 0,
	thumbnail: {
		path: "",
		alt: "",
	},
	description: "",
	quantity: 0,
	productPart: EnumProductType.ETC,
	status: EnumProductOptStatus.INSTOCK,
	productId: "",
});

const NewProductOption: React.FC<IProps> = (props) => {
	const { open, onClose, onSuccess, productOption, isEdit } = props;
	const [pendingCreateOptions, setPendingCreateOptions] = useState<
		Omit<IConfigProductOption, "createdAt" | "updatedAt" | "id">[]
	>([]);

	const initialValues = useMemo(() => {
		if (isEdit && productOption) {
			return {
				options: [productOption],
				productPart: productOption.productPart,
				productId: productOption.productId,
			};
		}

		return {
			options: [getDefaultOption()],
			productPart: EnumProductType.ETC,
			productId: "",
		};
	}, [isEdit, productOption]);

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: yup.object({
			options: yup.array().of(
				yup.object({
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
								return (
									value === undefined ||
									value <= this.parent.price
								);
							}
						),
					description: yup
						.string()
						.required("Description is required"),
					quantity: yup.number().required("Quantity is required"),

					isActive: yup.boolean(),
					thumbnail: yup.object({
						path: yup.string().required("Thumbnail is required"),
					}),
					status: yup.string(),
				})
			),
			productPart: yup.string().required("Product part is required"),
			productId: yup.string().required("Product id is required"),
		}),
		enableReinitialize: true,
		onSubmit: async (values) => {
			console.log("payload sumbit", values);
			handleSubmit(
				values as {
					options: IProductOption[];
					productPart: EnumProductType;
					productId: string;
				}
			);
		},
	});

	const handleOnChange = (idx: number, name: string, value: any) => {
		const updated = [...formik.values.options];
		updated[idx] = { ...updated[idx], [name]: value };
		formik.setFieldValue("options", updated);
	};

	const handleOnChangeProductParent = (name: string, value: any) => {
		formik.setFieldValue(name, value);
	};

	const syncImageToFormik = (
		idx: number,
		file: { publicUrl: string; size: number }
	) => {
		handleOnChange(idx, "thumbnail", {
			path: file.publicUrl,
			alt: "",
		});
	};

	const handleUpdateConfig = async (
		payload: Omit<IConfigProductOption, "createdAt" | "updatedAt" | "id">[]
	) => {
		try {
			const resp = await ConfigClient.addProductOption({
				body: {
					productOptions: formik.values.options.map((option) => ({
						name: option.name || "",
						description: option.description || "",
						isActive: option.isActive || false,
						createdAt: option.createdAt || new Date(),
						productPart: formik.values.productPart,
					})),
					updatedAt: new Date(),
					productId: formik.values.productId || "",
					productPart:
						formik.values.productPart || EnumProductType.ETC,
				},
			});
			if (resp.status !== HTTP_STATUS.Ok) {
				toast.error(resp.message);
			} else {
				toast.success("Cập nhật thành công");
				setPendingCreateOptions([]);
			}
		} catch (error) {
			toast.error("Có lỗi xảy ra trong quá trình cập nhật");
		}
	};

	const handleSubmit = async (payload: {
		options: IProductOption[];
		productPart: EnumProductType;
		productId: string;
	}) => {
		const signal = new AbortController().signal;
		let success = true;
		for (const values of payload.options) {
			const resp = await ProductOptionsClient.postNewProductOption({
				body: {
					...values,
					productId: payload.productId,
					productPart: payload.productPart,
					thumbnail: values.thumbnail ?? {
						path: "",
						alt: "",
					},
				},
				signal,
			});
			if (resp.status !== HTTP_STATUS.Ok) {
				success = false;
			}
		}
		if (success) {
			toast.success("Tạo mới thành công");
			formik.resetForm();
			onClose();
			onSuccess();
			handleUpdateConfig(pendingCreateOptions);
		} else {
			toast.error("Có lỗi xảy ra trong quá trình tạo mới");
		}
	};

	const handleAdd = () => {
		formik.setFieldValue("options", [
			...formik.values.options,
			getDefaultOption(),
		]);
	};

	const handleRemove = (idx: number) => {
		const updated = formik.values.options.filter((_, i) => i !== idx);
		formik.setFieldValue(
			"options",
			updated.length ? updated : [getDefaultOption()]
		);
	};

	const handleSelect = ({
		name = "",
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
	}) => {
		console.log(name, option);
		if (!name) return;
		// setSelected({ ...selected, [name]: option });
	};

	const handleAddNew = ({
		name = "",
		newOption,
	}: {
		name: string;
		newOption: IOptionSelection;
	}) => {
		console.log(name, newOption);
		// setOptions({ ...options, [name]: [...options[name], newOption] });
		// setSelected({ ...selected, [name]: newOption });
	};

	console.log(formik.values, pendingCreateOptions);

	return (
		<dialog className={`modal ${open ? "modal-open" : ""}`}>
			<div className="modal-box max-w-[min(80vw,850px)] max-h-[80vh] overflow-y-auto !p-0">
				<div className="sticky top-0 z-10 bg-white p-4">
					<h3 className="font-bold text-2xl mb-4">
						Tạo mới Product Option
					</h3>
					<div className="grid grid-cols-6 gap-2 sticky top-0 z-10 bg-white">
						<SelectionList
							options={productPartOptions}
							name="productPart"
							value={formik.values.productPart || ""}
							placeholder="Loại sản phẩm"
							className="col-span-2"
							disabled
						/>
						<ProductSelector
							name="productId"
							value={formik.values.productId || ""}
							onChange={handleOnChangeProductParent}
							placeholder="Tìm kiếm và chọn sản phẩm"
							label="Sản phẩm"
							className="col-span-4"
							isUpdate={isEdit}
						/>
					</div>
				</div>
				<form onSubmit={formik.handleSubmit}>
					<div className="space-y-4 p-4 min-h-[40vh]">
						{!formik.values.productId ? (
							<div className="flex flex-col items-center justify-center h-full">
								<p className="text-gray-500">
									Vui lòng chọn sản phẩm trước khi tạo option
								</p>
							</div>
						) : null}
						{formik.values.productId &&
							formik.values.options.map((option, idx) => (
								<div
									key={idx}
									className="relative border rounded p-4 bg-gray-100 flex flex-col gap-2">
									{formik.values.options.length > 1 ? (
										<button
											type="button"
											className="btn btn-xs btn-circle btn-error absolute top-2 right-2 z-[9]"
											onClick={() => handleRemove(idx)}
											disabled={
												formik.values.options.length ===
												1
											}
											title="Xóa option này">
											<X className="w-4 h-4 text-white" />
										</button>
									) : null}
									<div className="form-control">
										<label className="label">
											<span className="label-text">
												Option
											</span>
										</label>
										<OptionSelector
											name="name"
											value={option.name || ""}
											onChange={(name, value) =>
												handleOnChange(idx, name, value)
											}
											pendingCreateOptions={
												pendingCreateOptions
											}
											setPendingCreateOptions={
												setPendingCreateOptions
											}
											isUpdate={isEdit}
											// onUpdate={handleUpdateConfig}
										/>
										{formik.touched.options?.[idx]?.name &&
											typeof formik.errors.options?.[
												idx
											] === "object" &&
											formik.errors.options?.[idx] &&
											"name" in
												formik.errors.options[idx] && (
												<label className="label">
													<span className="label-text-alt text-error">
														{
															(
																formik.errors
																	.options[
																	idx
																] as any
															)?.name
														}
													</span>
												</label>
											)}
									</div>

									<div className="flex gap-4">
										<div className="form-control flex-1">
											<label className="label">
												<span className="label-text">
													Số lượng tồn
												</span>
											</label>
											<input
												type="number"
												id="quantity"
												name="quantity"
												className={`input input-bordered w-full ${
													formik.touched.options?.[
														idx
													]?.quantity &&
													typeof formik.errors
														.options?.[idx] ===
														"object" &&
													formik.errors.options?.[
														idx
													] &&
													"quantity" in
														formik.errors.options[
															idx
														]
														? "input-error"
														: ""
												}`}
												value={option.quantity}
												onChange={(e) =>
													handleOnChange(
														idx,
														"quantity",
														Number(e.target.value)
													)
												}
											/>
											{formik.touched.options?.[idx]
												?.quantity &&
												typeof formik.errors.options?.[
													idx
												] === "object" &&
												formik.errors.options?.[idx] &&
												"quantity" in
													formik.errors.options[
														idx
													] && (
													<label className="label">
														<span className="label-text-alt text-error">
															{
																(
																	formik
																		.errors
																		.options[
																		idx
																	] as any
																)?.quantity
															}
														</span>
													</label>
												)}
											<span className="text-green-600 text-sm mt-1">
												{formatNumber(
													option.quantity || 0
												)}
											</span>
										</div>
										<div className="form-control flex-1">
											<label className="label">
												<span className="label-text">
													Giá
												</span>
											</label>
											<input
												type="number"
												id="price"
												name="price"
												className={`input input-bordered w-full ${
													formik.touched.options?.[
														idx
													]?.price &&
													typeof formik.errors
														.options?.[idx] ===
														"object" &&
													formik.errors.options?.[
														idx
													] &&
													"price" in
														formik.errors.options[
															idx
														]
														? "input-error"
														: ""
												}`}
												value={option.price}
												onChange={(e) =>
													handleOnChange(
														idx,
														"price",
														Number(e.target.value)
													)
												}
											/>
											{formik.touched.options?.[idx]
												?.price &&
												typeof formik.errors.options?.[
													idx
												] === "object" &&
												formik.errors.options?.[idx] &&
												"price" in
													formik.errors.options[
														idx
													] && (
													<label className="label">
														<span className="label-text-alt text-error">
															{
																(
																	formik
																		.errors
																		.options[
																		idx
																	] as any
																)?.price
															}
														</span>
													</label>
												)}
											<span className="text-green-600 text-sm mt-1">
												{formatCurrency(
													option.price || 0
												)}
											</span>
										</div>
										<div className="form-control flex-1">
											<label className="label">
												<span className="label-text">
													Giá khuyến mãi
												</span>
											</label>
											<input
												type="number"
												id="salePrice"
												name="salePrice"
												className={`input input-bordered w-full ${
													formik.touched.options?.[
														idx
													]?.salePrice &&
													typeof formik.errors
														.options?.[idx] ===
														"object" &&
													formik.errors.options?.[
														idx
													] &&
													"salePrice" in
														formik.errors.options[
															idx
														]
														? "input-error"
														: ""
												}`}
												value={option.salePrice}
												onChange={(e) =>
													handleOnChange(
														idx,
														"salePrice",
														Number(e.target.value)
													)
												}
											/>
											{formik.touched.options?.[idx]
												?.salePrice &&
												typeof formik.errors.options?.[
													idx
												] === "object" &&
												formik.errors.options?.[idx] &&
												"salePrice" in
													formik.errors.options[
														idx
													] && (
													<label className="label">
														<span className="label-text-alt text-error">
															{
																(
																	formik
																		.errors
																		.options[
																		idx
																	] as any
																)?.salePrice
															}
														</span>
													</label>
												)}
											{!formik.errors.options?.[idx] ||
											(typeof formik.errors.options?.[
												idx
											] === "object" &&
												formik.errors.options?.[idx] &&
												!(
													"salePrice" in
													formik.errors.options[idx]
												)) ? (
												<span className="text-green-600 text-sm mt-1">
													{formatCurrency(
														option.salePrice || 0
													)}
												</span>
											) : null}
										</div>
									</div>

									<div className="flex gap-4">
										<div className="flex flex-col mt-2 border max-w-max px-2 relative min-w-[15vw] w-full rounded-[4px] justify-center">
											<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
												Trạng thái hiện thị
											</label>
											<div className="flex gap-2 items-center py-4">
												<input
													type="checkbox"
													id="isActive"
													name="isActive"
													className="toggle toggle-primary"
													checked={option.isActive}
													onChange={(e) =>
														handleOnChange(
															idx,
															"isActive",
															e.target.checked
														)
													}
													value={
														option.isActive
															? EnumSaleStatus.INSTOCK
															: EnumSaleStatus.OUTSTOCK
													}
												/>
												<label
													htmlFor="isActive"
													className="">
													{option.isActive
														? "Bật"
														: "Tắt"}
												</label>
											</div>
										</div>
									</div>

									<TextEditor
										key={idx}
										id={`description-${idx}`}
										label="Nội dung chi tiết"
										value={option.description || ""}
										onChange={(value) =>
											handleOnChange(
												idx,
												"description",
												value
											)
										}
										placeholder="Nội dung chi tiết"
										className="mt-4"
										maxContent={500}
									/>

									<UploadImage
										label="Ảnh sản phẩm đại diện"
										handleSyncData={(file) =>
											syncImageToFormik(idx, file)
										}
									/>
								</div>
							))}
					</div>

					<div className="modal-action sticky bottom-0 z-10 bg-white p-4">
						<div className="w-full items-center flex justify-between">
							<button
								type="button"
								className="btn btn-outline"
								onClick={handleAdd}
								disabled={!formik.values.productId}>
								+ Thêm option
							</button>
							<div className="flex gap-4">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => {
										onClose();
										formik.resetForm();
										// formik.setFieldValue("options", [
										// 	getDefaultOption(),
										// ]);
									}}>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary">
									Create
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</dialog>
	);
};

export default NewProductOption;
