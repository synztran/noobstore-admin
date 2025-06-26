import React, { useEffect, useRef, useState } from "react";

interface SelectProps {
	options: { value: string; label: string; disabled?: boolean }[];
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
	label?: string;
}

const SelectionList: React.FC<SelectProps> = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	name,
	label,
}) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [selectOptions, setSelectOptions] = useState<
		{
			value: string;
			label: string;
			disabled?: boolean;
		}[]
	>(options);
	const dropdownRef = useRef<HTMLDivElement>(null);

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

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleSelectOption = (option: {
		value: string;
		label: string;
		disabled?: boolean;
	}) => {
		if (option.disabled) return;
		onChange(name, option.value);
		setInputValue("");
		setOpen(false);
	};

	const filteredOptions = selectOptions.filter((option) =>
		option.label.toLowerCase().includes(inputValue.toLowerCase())
	);

	const selectedOption = selectOptions.find(
		(option) => option.value === value
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className={`form-control w-full ${className}`} ref={dropdownRef}>
			{label && (
				<label className="label">
					<span className="label-text">{label}</span>
				</label>
			)}
			<div className="relative">
				<input
					type="text"
					placeholder={placeholder || "Select"}
					className="input input-bordered w-full"
					value={selectedOption ? selectedOption.label : inputValue}
					onChange={handleInputChange}
					onFocus={handleOpen}
					readOnly={!!selectedOption}
				/>
				{loading && (
					<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
						<span className="loading loading-spinner loading-sm"></span>
					</div>
				)}
			</div>

			{open && (
				<ul className="menu menu-sm bg-base-100 w-full mt-2 shadow-lg rounded-box max-h-60 overflow-auto absolute z-50">
					{loading ? (
						<li className="text-center py-2">
							<span className="loading loading-spinner loading-sm"></span>
							<span className="ml-2">Đang tải...</span>
						</li>
					) : filteredOptions.length === 0 ? (
						<li className="text-center py-2 text-base-content/60">
							Không có danh mục theo từ khóa này
						</li>
					) : (
						filteredOptions.map((option) => (
							<li key={option.value}>
								<button
									type="button"
									onClick={() => handleSelectOption(option)}
									className={`w-full text-left ${
										option.disabled
											? "opacity-50 cursor-not-allowed"
											: "hover:bg-base-200"
									}`}
									disabled={option.disabled}>
									{option.label}
								</button>
							</li>
						))
					)}
				</ul>
			)}
		</div>
	);
};

export default SelectionList;
