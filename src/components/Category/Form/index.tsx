import type { ICategory } from "@/interfaces";
import { formatCurrency } from "@/utils/FormatNumber";
import SaleTypeSelector from "../SaleTypeSelector";
import FeesInput from "../FeeInput";
import CollapseContentEditor from "../CollapseContentEditor";
import CategoryTypeSelector from "../CategoryTypeSelector";
import TextEditor from "@/components/Texteditor";
import UploadImage from "@/components/InputComponents/UploadImage";
import type { FormikContextType } from "formik";

interface IProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: ICategory) => void;
	targetEdit: ICategory | null;
	formik: FormikContextType<ICategory>;
}

const CategoryForm = ({
	open,
	onClose,
	// onSubmit,
	targetEdit,
	formik,
}: IProps) => {
	const syncImageToFormik = (file: { publicUrl: string; size: number }) => {
		formik.setFieldValue("thumbnail", {
			path: file.publicUrl,
			size: file.size,
		});
	};

	return (
		<dialog className={`modal ${open ? "modal-open" : ""}`}>
			<div className="modal-box max-w-[60vw] max-h-[80vh] overflow-y-auto">
				<h3 className="font-bold text-2xl mb-4">
					{targetEdit ? "Cập nhật category" : "Tạo mới category"}
				</h3>
				<form onSubmit={formik.handleSubmit}>
					<div className="py-0 px-4 flex flex-col gap-2">
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text">Tên category</span>
							</label>
							<input
								type="text"
								id="categoryName"
								name="categoryName"
								className={`input input-bordered w-full ${
									formik.touched.categoryName &&
									Boolean(formik.errors.categoryName)
										? "input-error"
										: ""
								}`}
								value={formik.values.categoryName}
								onChange={formik.handleChange}
							/>
							{formik.touched.categoryName &&
								formik.errors.categoryName && (
									<label className="label">
										<span className="label-text-alt text-error">
											{formik.errors.categoryName}
										</span>
									</label>
								)}
						</div>
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text">Mô tả ngắn</span>
							</label>
							<input
								type="text"
								id="description"
								name="description"
								className={`input input-bordered w-full ${
									formik.touched.description &&
									Boolean(formik.errors.description)
										? "input-error"
										: ""
								}`}
								value={formik.values.description}
								onChange={formik.handleChange}
							/>
							{formik.touched.description &&
								formik.errors.description && (
									<label className="label">
										<span className="label-text-alt text-error">
											{formik.errors.description}
										</span>
									</label>
								)}
						</div>
						<div className="flex gap-4">
							<div className="relative w-full">
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text">
											Giá thấp nhất
										</span>
									</label>
									<input
										type="number"
										id="minPrice"
										name="minPrice"
										className={`input input-bordered w-full ${
											formik.touched.minPrice &&
											Boolean(formik.errors.minPrice)
												? "input-error"
												: ""
										}`}
										value={formik.values.minPrice}
										onChange={formik.handleChange}
									/>
									{formik.touched.minPrice &&
										formik.errors.minPrice && (
											<label className="label">
												<span className="label-text-alt text-error">
													{formik.errors.minPrice}
												</span>
											</label>
										)}
								</div>
								<span className="absolute -bottom-6 left-1 text-green-600">
									{formatCurrency(formik.values.minPrice)}
								</span>
							</div>
							<div className="relative w-full">
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text">
											Giá cao nhất
										</span>
									</label>
									<input
										type="number"
										id="maxPrice"
										name="maxPrice"
										className={`input input-bordered w-full ${
											formik.touched.maxPrice &&
											Boolean(formik.errors.maxPrice)
												? "input-error"
												: ""
										}`}
										value={formik.values.maxPrice}
										onChange={formik.handleChange}
									/>
									{formik.touched.maxPrice &&
										formik.errors.maxPrice && (
											<label className="label">
												<span className="label-text-alt text-error">
													{formik.errors.maxPrice}
												</span>
											</label>
										)}
								</div>
								<span className="absolute -bottom-6 left-0 text-green-600">
									{formatCurrency(formik.values.maxPrice)}
								</span>
							</div>
						</div>
						<SaleTypeSelector formik={formik} />
						<FeesInput formik={formik} />
						<CollapseContentEditor formik={formik} />
						{/* <ConfigQuantity formik={formik} /> */}
						<div className="flex gap-4 mt-4 items-center">
							<div className="flex flex-col mt-2 border max-w-max px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px] justify-center">
								<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
									Trạng thái hiện thị
								</label>
								<div className="flex gap-2 items-center mt-2">
									<input
										type="checkbox"
										id="isActive"
										name="isActive"
										className="toggle toggle-primary"
										checked={formik.values.isActive}
										onChange={formik.handleChange}
									/>
									<label htmlFor="isActive" className="">
										{formik.values.isActive ? "Bật" : "Tắt"}
									</label>
								</div>
							</div>
							<CategoryTypeSelector formik={formik} />
						</div>
						<TextEditor
							id="content"
							label="Nội dung chi tiết"
							value={formik.values.content}
							onChange={(value: string) =>
								formik.setFieldValue("content", value)
							}
							placeholder="Nội dung chi tiết"
							onBlur={() =>
								formik.setFieldTouched("content", true)
							}
							errorMessage={
								formik.touched.content
									? formik.errors.content
									: ""
							}
							maxContent={500}
						/>
						<UploadImage
							handleSyncData={syncImageToFormik}
							thumbnailUploaded={[formik.values.thumbnail?.path]}
							label="Ảnh sản phẩm đại diện"
						/>
					</div>
					<div className="modal-action">
						<button
							type="button"
							onClick={onClose}
							className="btn btn-secondary">
							Cancel
						</button>
						<button type="submit" className="btn btn-primary">
							{targetEdit ? "Update" : "Create"}
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

export default CategoryForm;
