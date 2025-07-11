import TextEditor from "@/components/Texteditor";
import UploadImage from "@/components/InputComponents/UploadImage";
import { HTTP_STATUS, productPartOptions } from "@/constants";
import { formatCurrency } from "@/utils/FormatNumber";
import React, { useEffect, useState } from "react";
import MultipleSelectionList, { type TOptions } from "../MultipleSelectList";
import CategorySelection from "../CategorySelect";
import SelectionList from "../SelectionList";
import type { IProduct, IProductOption } from "@/interfaces";
import ProductsClient from "@/client/ProductsClient";
import toast from "react-hot-toast";
import ProductSelection from "../ProductSelect";
import type { FormikContextType } from "formik";

interface IProps {
	formik: FormikContextType<IProduct>;
	open: boolean;
	onClose: () => void;
	isEdit?: boolean;
}

const NewProduct: React.FC<IProps> = (props) => {
	const { formik, open, onClose, isEdit = false } = props;
  console.log("formik", formik, formik.values)
	const [productOptions, setProductOptions] = useState<IProductOption[]>([]);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		(async () => {
			const res = await ProductsClient.getProductOptions({
				body: {
					productId: formik.values.productId || "",
					productPart: formik.values.productPart,
					productOptionIds: [],
				},
				signal: new AbortController().signal,
			});
			if (res.status === HTTP_STATUS.Ok) {
				setProductOptions(res.data || []);
			} else {
				toast.error(res.message);
			}
			setLoading(false);
		})();
	}, [formik.values.productPart, formik.values.productId]);

	const handleOnChange = (name: string, value: string) => {
		formik.setFieldValue(name, value);
	};

	const syncImageToFormik = (file: { publicUrl: string; size: number }) => {
		formik.setFieldValue("thumbnail", {
			path: file.publicUrl,
			size: file.size,
		});
	};

	if (!open) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-[min(80vw,900px)] max-h-[80vh] overflow-y-auto">
				<h3 className="font-bold text-2xl mb-4">
					{isEdit ? "Chỉnh sửa" : "Tạo mới"} Sản phẩm
				</h3>
				<form onSubmit={formik.handleSubmit}>
					<div className="space-y-4">
						<CategorySelection
							onChange={handleOnChange}
							name="categoryId"
							placeholder="Chọn danh mục sản phẩm"
							value={formik.values.categoryId}
							className="mt-4"
							isUpdate={isEdit}
							label="Danh mục"
						/>
						<ProductSelection
							categoryId={formik.values.categoryId}
							name="productId"
							value={formik.values.productId || ""}
							onChange={handleOnChange}
							placeholder="Chọn sản phẩm"
							className="mt-4"
							label="Sản phẩm"
						/>
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text">Tên sản phẩm</span>
							</label>
							<input
								type="text"
								id="productName"
								name="productName"
								className={`input input-bordered w-full ${
									formik.touched.productName &&
									formik.errors.productName
										? "input-error"
										: ""
								}`}
								value={formik.values.productName}
								onChange={formik.handleChange}
							/>
							{formik.touched.productName &&
								formik.errors.productName && (
									<label className="label">
										<span className="label-text-alt text-error">
											{formik.errors.productName}
										</span>
									</label>
								)}
						</div>
						<div className="grid grid-cols-1 items-start gap-2">
							<SelectionList
								options={productPartOptions}
								name="productPart"
								value={formik.values.productPart}
								placeholder="Lựa chọn loại sản phẩm"
								onChange={handleOnChange}
								className="col-span-1"
								label="Loại sản phẩm"
							/>
						</div>

						<MultipleSelectionList
							className="relative"
							name="optionGroups.optionIds"
							setFieldValue={formik.setFieldValue}
							values={formik.values.optionGroups?.optionIds || []}
							options={
								(productOptions?.map((option: IProductOption) => ({
									id: option.id,
									name: option.name,
									salePrice: option.salePrice,
									price: option.price,
								})) as TOptions[]) || []
							}
							fetching={isLoading}
							disabled={!formik.values.categoryId}
						/>

						<div className="flex items-center gap-2 col-span-1">
							<div className="form-control w-full">
								<label className="label">
									<span className="label-text">Giá gốc</span>
								</label>
								<input
									type="number"
									id="price"
									name="price"
									className={`input input-bordered w-full ${
										formik.touched.price &&
										formik.errors.price
											? "input-error"
											: ""
									}`}
									value={formik.values.price}
									onChange={formik.handleChange}
								/>
								<span className="text-green-600 text-sm mt-1">
									{formatCurrency(formik.values.price)}
								</span>
								{formik.touched.price &&
									formik.errors.price && (
										<label className="label">
											<span className="label-text-alt text-error">
												{formik.errors.price}
											</span>
										</label>
									)}
							</div>
							<div className="form-control w-full">
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
										formik.touched.salePrice &&
										formik.errors.salePrice
											? "input-error"
											: ""
									}`}
									value={formik.values.salePrice}
									onChange={formik.handleChange}
								/>
								<span className="text-green-600 text-sm mt-1">
									{formatCurrency(
										formik.values.salePrice || 0
									)}
								</span>
								{formik.touched.salePrice &&
									formik.errors.salePrice && (
										<label className="label">
											<span className="label-text-alt text-error">
												{formik.errors.salePrice}
											</span>
										</label>
									)}
							</div>
						</div>

						<div className="grid grid-cols-3 gap-2">
							<div className="col-span-1 form-control">
								<div className="flex flex-col mt-2 border px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px] justify-center">
									<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
										<span className="label-text">
											Trạng thái hiện thị
										</span>
									</label>
									<div className="flex gap-2 items-center">
										<input
											type="checkbox"
											id="isActive"
											name="isActive"
											className="toggle toggle-primary"
											checked={formik.values.isActive}
											onChange={formik.handleChange}
										/>
										<label
											htmlFor="isActive"
											className="label-text">
											{formik.values.isActive
												? "Bật"
												: "Tắt"}
										</label>
									</div>
								</div>
							</div>
							<div className="col-span-1 form-control">
								<div className="flex flex-col mt-2 border px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px] justify-center">
									<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
										<span className="label-text">
											Nhiều lựa chọn
										</span>
									</label>
									<div className="flex gap-2 items-center">
										<input
											type="checkbox"
											id="isMultiple"
											name="isMultiple"
											className="toggle toggle-primary"
											checked={formik.values.isMultiple}
											onChange={formik.handleChange}
										/>
										<label
											htmlFor="isMultiple"
											className="label-text">
											{formik.values.isMultiple
												? "Có"
												: "Không"}
										</label>
									</div>
								</div>
							</div>
							<div className="col-span-1 form-control">
								<div className="flex flex-col mt-2 border px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px] justify-center">
									<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
										<span className="label-text">
											Bắt buộc
										</span>
									</label>
									<div className="flex gap-2 items-center">
										<input
											type="checkbox"
											id="isRequired"
											name="isRequired"
											className="toggle toggle-primary"
											checked={formik.values.isRequired}
											onChange={formik.handleChange}
										/>
										<label
											htmlFor="isRequired"
											className="label-text">
											{formik.values.isRequired
												? "Có"
												: "Không"}
										</label>
									</div>
								</div>
							</div>
						</div>
						<TextEditor
							label="Nội dung chi tiết"
							value={formik.values.description ?? ""}
							  onChange={(value: string) =>
								formik.setFieldValue("description", value)
							}
							placeholder="Nội dung chi tiết"
							className="mt-4"
							maxContent={500}
						/>
						<UploadImage
							label="Ảnh sản phẩm đại diện"
							handleSyncData={syncImageToFormik}
							thumbnailUploaded={[formik.values.thumbnail?.path]}
						/>
					</div>
					<div className="modal-action  ">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary">
							{isEdit ? "Cập nhật" : "Tạo mới"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NewProduct;
