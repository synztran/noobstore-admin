import { RCategoryType } from "@/constants";

interface IProps {
	formik: any;
}

const CategoryTypeSelector = ({ formik }: IProps) => {
	return (
		<div className="form-control w-full">
			<div className="flex flex-col mt-2 border px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px] justify-center">
				<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
					<span className="label-text">Loại category</span>
				</label>
				<select
					id="type"
					name="type"
					className="select select-bordered w-full"
					value={formik.values.type}
					onChange={formik.handleChange}>
					{Object.entries(RCategoryType)?.map(([key, value]) => (
						<option key={key} value={key}>
							{value}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default CategoryTypeSelector;
