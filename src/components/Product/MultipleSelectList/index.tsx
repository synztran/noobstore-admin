import type { IProductOption } from "@/interfaces";
import { formatCurrency } from "@/utils/FormatNumber";
import { X } from "lucide-react";
import React, { memo, useRef, useState } from "react";

export interface TOptions {
	id: string;
	name: string;
	salePrice: number;
	price: number;
}

interface IProps {
	values?: string[];
	className?: string;
	name?: string;
	setFieldValue?: (field: string, value: string[]) => void;
	options: TOptions[];
	fetching?: boolean;
	disabled?: boolean;
}

const MultipleSelectionList: React.FC<IProps> = ({
	values = [],
	className = "",
	name = "",
	setFieldValue,
	options = [],
	fetching = false,
	disabled = false,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const selectedOptions = options.filter((option) =>
		values?.includes(option.id)
	);
	const filteredOptions = options.filter(
		(option) =>
			option.name.toLowerCase().includes(inputValue.toLowerCase()) &&
			!values.includes(option.id)
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		setIsOpen(true);
	};

	const handleSelectOption = (option: TOptions) => {
		const newValues = [...values, option.id];
		setFieldValue && setFieldValue(name, newValues);
		setInputValue("");
		setIsOpen(false);
		if (inputRef.current) inputRef.current.focus();
	};

	const handleRemoveOption = (id: string) => {
		const newValues = (values || []).filter((v) => v !== id);
		setFieldValue && setFieldValue(name, newValues);
	};

	const handleInputFocus = () => {
		setIsOpen(true);
	};

	const handleInputBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setTimeout(() => setIsOpen(false), 150);
		}
	};

	const handleCopyToClipboard = (option: IProductOption) => {
		navigator.clipboard.writeText(option.id || "");
	};

	return (
		<div
			className={`form-control flex flex-col mt-2 border p-2 relative min-w-[15vw] w-full h-auto rounded-[4px] justify-center ${className}`}>
			<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
				Tùy chọn option loại sản phẩm
			</label>
			<div
				tabIndex={-1}
				onBlur={handleInputBlur}
				className="relative h-full">
				<div
					className={`input input-bordered w-full flex flex-wrap gap-2 p-2 min-h-[40px] h-full ${
						isOpen ? "input-primary" : ""
					}`}>
					{fetching ? (
						<div className="flex items-center justify-center h-full">
							<span className="loading loading-spinner loading-md"></span>
						</div>
					) : (
						<>
							{selectedOptions
								.filter(
									(option) => typeof option.id === "string"
								)
								.map((option) => (
									<div
										key={option.id}
										className="badge badge-outline gap-1">
										<span
											className="cursor-pointer"
											onClick={() =>
												handleCopyToClipboard(option)
											}>
											{option.name} - {option.id} (+
											{formatCurrency(
												option.salePrice ||
													option.price ||
													0
											)}
											)
										</span>
										<X
											className="w-4 h-4 cursor-pointer text-red-400"
											onClick={() => {
												if (option.id)
													handleRemoveOption(
														option.id
													);
											}}
										/>
									</div>
								))}
							<input
								type="text"
								ref={inputRef}
								value={inputValue}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								placeholder={
									disabled
										? "Bạn chưa chọn danh mục sản phẩm"
										: "Tìm kiếm option"
								}
								className="flex-1 min-w-0 bg-transparent border-none outline-none"
								disabled={disabled}
							/>
						</>
					)}
				</div>
				{isOpen && (
					<ul className="menu menu-sm bg-base-100 w-full shadow-lg rounded-box overflow-auto absolute z-50 top-full mt-1">
						{filteredOptions.length > 0 ? (
							filteredOptions.map((option) => (
								<li key={option.id}>
									<button
										type="button"
										onMouseDown={() =>
											handleSelectOption(option)
										}
										className="flex items-center justify-between hover:bg-base-200">
										<span className="text-base">
											{option.name} - {option.id} (+
											{formatCurrency(
												option.salePrice ||
													option.price ||
													0
											)}
											)
										</span>
									</button>
								</li>
							))
						) : (
							<li>
								<span className="text-sm text-base-content/60">
									Không có option nào
								</span>
							</li>
						)}
					</ul>
				)}
			</div>
			<span className="text-xs italic text-base-content/60 mt-1">
				ấn vào option để copy id
			</span>
		</div>
	);
};

export default memo(MultipleSelectionList);
