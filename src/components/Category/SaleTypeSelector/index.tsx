import { EnumCategorySaleType } from "@/interfaces";
import { formatCurrency } from "@/utils/FormatNumber";

interface IProps {
	formik: any;
}

const SaleTypeSelector = ({ formik }: IProps) => {
	return (
		<div className="flex items-center gap-4 mt-4">
			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">Loại giảm giá</span>
				</label>
				<select
					id="saleType"
					name="saleType"
					className="select select-bordered w-full"
					value={formik.values.saleType}
					onChange={(e) => {
						formik.handleChange("saleType")(e);
						formik.setFieldValue("saleValue", 0);
					}}>
					<option value={EnumCategorySaleType.NONE}>
						Không giảm giá
					</option>
					<option value={EnumCategorySaleType.ABSOLUTE}>
						Giảm trực tiếp vào sản phẩm
					</option>
					<option value={EnumCategorySaleType.PERCENT}>
						Giảm theo phần trăm
					</option>
				</select>
			</div>
			{formik.values.saleType !== EnumCategorySaleType.NONE ? (
				<div className="relative w-full">
					<div className="form-control w-full">
						<label className="label">
							<span className="label-text">Giá trị giảm giá</span>
						</label>
						<input
							type="number"
							id="saleValue"
							name="saleValue"
							className="input input-bordered w-full"
							value={formik.values.saleValue}
							onChange={formik.handleChange}
						/>
					</div>
					<span className="absolute -bottom-6 left-1 text-green-600">
						{formik.values.saleType ===
						EnumCategorySaleType.ABSOLUTE
							? formatCurrency(formik.values.saleValue)
							: formik.values.saleType ===
							  EnumCategorySaleType.PERCENT
							? `${formik.values.saleValue}%`
							: "N/A"}
					</span>
				</div>
			) : null}
		</div>
	);
};

export default SaleTypeSelector;
