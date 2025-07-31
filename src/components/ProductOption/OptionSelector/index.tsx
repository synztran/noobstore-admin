import { getData, getFirst } from "@/client";
import ConfigClient from "@/client/ConfigClient";
import { HTTP_STATUS } from "@/constants";
import type { IConfigProductOption } from "@/interfaces";
import { X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
	isUpdate?: boolean;
	label?: string;
	pendingCreateOptions?: Omit<
		IConfigProductOption,
		"createdAt" | "updatedAt" | "id"
	>[];
	setPendingCreateOptions: (
		pendingAdd: Omit<
			IConfigProductOption,
			"createdAt" | "updatedAt" | "id"
		>[]
	) => void;
	index?: number; // <-- add index prop
	// onUpdate: (payload: any) => void;
}

const OptionSelector: React.FC<IProps> = ({
	value,
	onChange,
	placeholder,
	className,
	name,
	isUpdate = false,
	label,
	pendingCreateOptions,
	setPendingCreateOptions,
	index,
	// onUpdate,
}) => {
	console.log("value", value);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	// const [adding, setAdding] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [defaultConfigOptions, setDefaultConfigOptions] = useState<
		{
			value: string;
			label: string;
			disabled?: boolean;
		}[]
	>([]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const fetchConfigOptions = async () => {
		setLoading(true);
		const resp = await ConfigClient.getAllConfig({
			signal: new AbortController().signal,
		});
		console.log("resp", resp);
		if (resp.status !== HTTP_STATUS.Ok) {
			setLoading(false);
			setDefaultConfigOptions([]);
			toast.error("Lỗi khi lấy danh sách danh mục");
			return;
		}
		const configProductOptions =
			resp.data
				?.map((item) => item.configProductOptions)
				?.filter((item) => Boolean(item))
				?.flat() || [];
		console.log("configProductOptions", configProductOptions);
		const filterOptions = (
			configProductOptions as IConfigProductOption[]
		)?.map((item: IConfigProductOption) => ({
			value: item.id,
			label: item.name,
			disabled: !item.isActive,
		})) as {
			value: string;
			label: string;
			disabled?: boolean;
		}[];
		setDefaultConfigOptions(filterOptions || []);
		setLoading(false);
	};

	const handleOpen = async () => {
		setOpen(true);
		if (defaultConfigOptions.length === 0) {
			await fetchConfigOptions();
		}
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
		onChange(name, option.value); // index is handled by parent
		setInputValue("");
		setOpen(false);
	};

	// Instead of calling API here, just set pendingAdd and select the value as a "pending" value
	const handleAddNewOption = async () => {
		const trimmed = inputValue.trim();
		if (!trimmed) {
			toast.error("Tên danh mục không được để trống");
			return;
		}
		setPendingCreateOptions([
			...(pendingCreateOptions || []),
			{
				isActive: true,
				name: trimmed,
				description: trimmed,
			},
		]);
		const newOption = {
			value: trimmed,
			label: trimmed,
			disabled: false,
		};
		setDefaultConfigOptions((prev) => [...prev, newOption]);
		onChange(name, newOption.value); // index is handled by parent
		setInputValue("");
		setOpen(false);
		toast.success("Đã thêm danh mục mới (chờ tạo khi lưu sản phẩm)");
	};

	// When the parent form actually creates the product option, it should call the API using pendingAdd
	// This component only marks the intent to add a new option

	const filteredOptions = useMemo(() => {
		return defaultConfigOptions.filter((option) =>
			option.label.toLowerCase().includes(inputValue.toLowerCase())
		);
	}, [defaultConfigOptions, inputValue]);

	const selectedOption = useMemo(() => {
		return defaultConfigOptions.find((option) => option.value === value);
	}, [defaultConfigOptions, value]);

	console.log("selectedOption", selectedOption);

	useEffect(() => {
		if (isUpdate) {
			(async () => {
				await fetchConfigOptions();
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
				<div className="flex items-center relative">
					<input
						type="text"
						placeholder={placeholder || "Tìm kiếm và chọn danh mục"}
						className="input input-bordered w-full pr-10"
						value={
							selectedOption ? selectedOption.label : inputValue
						}
						onChange={handleInputChange}
						onFocus={handleOpen}
						readOnly={!!selectedOption}
					/>
					{selectedOption && (
						<button
							type="button"
							className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
							onClick={() => {
								onChange(name, "");
								setInputValue("");
								setOpen(false);
							}}
							tabIndex={-1}
							aria-label="Clear selection">
							<X className="w-6 h-6" />
						</button>
					)}
				</div>
				{loading && (
					<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
						<span className="loading loading-spinner loading-sm"></span>
					</div>
				)}
			</div>

			{open && (
				<ul className="menu menu-sm bg-base-100 w-full mt-2 shadow-lg rounded-box max-h-60 overflow-auto absolute z-50">
					{loading ? (
						<li className="text-center py-2 pointer-events-none">
							<span className="ml-2">Đang tải danh mục...</span>
						</li>
					) : filteredOptions.length === 0 ? (
						<>
							<li className="text-center py-2 text-base-content/60">
								Không có danh mục theo từ khóa này
							</li>
							<li className="text-center py-2">
								<button
									type="button"
									className="btn btn-primary btn-sm w-full"
									onClick={handleAddNewOption}
									disabled={!inputValue.trim()}>
									<div>
										+ Thêm mới:{" "}
										<span className="font-semibold">
											{inputValue.trim()}
										</span>
									</div>
								</button>
							</li>
						</>
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

export default OptionSelector;
