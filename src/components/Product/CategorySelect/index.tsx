import CategoryClient from "@/client/CategoryClient";
import { HTTP_STATUS } from "@/constants";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface SelectProps {
	options?: { value: string; label: string }[];
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
	isUpdate?: boolean;
	label?: string;
}

const CategorySelection: React.FC<SelectProps> = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	name,
	isUpdate = false,
	label,
}) => {
	console.log("value", value);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [categoryOptions, setCategoryOptions] = useState<
		{
			value: string;
			label: string;
			disabled?: boolean;
		}[]
	>([]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const fetchCategories = async () => {
		setLoading(true);
		const resp = await CategoryClient.getAllCategory({});
		if (resp.status !== HTTP_STATUS.Ok) {
			setLoading(false);
			setCategoryOptions([]);
			toast.error("Lỗi khi lấy danh sách danh mục");
			return;
		}
		const filterOptions = resp?.data?.map((item) => ({
			value: item.categoryId,
			label: item.categoryName,
			disabled: !item.isActive,
		})) as {
			value: string;
			label: string;
			disabled?: boolean;
		}[];
		setCategoryOptions(filterOptions || []);
		setLoading(false);
	};

	const handleOpen = async () => {
		setOpen(true);
		await fetchCategories();
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

	const filteredOptions = useMemo(() => {
		return categoryOptions.filter((option) =>
			option.label.toLowerCase().includes(inputValue.toLowerCase())
		);
	}, [categoryOptions, inputValue]);

	const selectedOption = useMemo(() => {
		return categoryOptions.find((option) => option.value === value);
	}, [categoryOptions, value]);

	useEffect(() => {
		if (isUpdate) {
			(async () => {
				await fetchCategories();
			})();
		}
	}, [isUpdate]);

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
		<div
			className={`form-control w-full relative ${className}`}
			ref={dropdownRef}>
			{label && (
				<label className="label">
					<span className="label-text">{label}</span>
				</label>
			)}
			<div className="relative">
				<input
					type="text"
					placeholder={placeholder || "Chọn danh mục"}
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
							<span className="ml-2">Đang tải danh mục...</span>
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
									{option.label} - {option.value}
								</button>
							</li>
						))
					)}
				</ul>
			)}
		</div>
	);
};

export default CategorySelection;
