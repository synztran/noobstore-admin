import React from "react";

interface SelectProps {
	options: { value: string; label: string; disabled?: boolean }[];
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
}

const SelectionList: React.FC<SelectProps> = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	name,
}) => {
	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [selectOptions, setSelectOptions] = React.useState<
		{
			value: string;
			label: string;
			disabled?: boolean;
		}[]
	>(options);

	const handleOpen = async () => {
		setOpen(true);
		setLoading(true);
		const filterOptions = options?.map((item) => ({
			value: item.value,
			label: item.label,
			disabled: item.disabled ?? false,
		}));
		setSelectOptions(filterOptions || []);
		setLoading(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const selectedOption = selectOptions.find((option) => option?.value === value);

	return (
		<div className={`dropdown ${open ? 'dropdown-open' : ''} ${className || ''}`}>
			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">{placeholder || "Select"}</span>
				</label>
				<div
					className="input input-bordered w-full cursor-pointer flex items-center justify-between"
					onClick={() => setOpen(!open)}
				>
					<span className={selectedOption ? '' : 'text-gray-400'}>
						{selectedOption ? selectedOption.label : placeholder || "Select"}
					</span>
					<div className="flex items-center gap-2">
						{loading && (
							<div className="loading loading-spinner loading-sm"></div>
						)}
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
			</div>

			{open && (
				<ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-50">
					{selectOptions.length > 0 ? (
						selectOptions.map((option) => (
							<li key={option.value}>
								<button
									className={`w-full text-left px-4 py-2 hover:bg-base-200 ${
										option.disabled ? 'opacity-50 cursor-not-allowed' : ''
									} ${option.value === value ? 'bg-base-200' : ''}`}
									onClick={() => {
										if (!option.disabled) {
											onChange(name, option.value);
											setOpen(false);
										}
									}}
									disabled={option.disabled}
								>
									{option.label}
								</button>
							</li>
						))
					) : (
						<li className="px-4 py-2 text-gray-500">
							Không có danh mục theo từ khóa này
						</li>
					)}
				</ul>
			)}
		</div>
	);
};

export default SelectionList;
