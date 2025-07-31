import ProductsClient from "@/client/ProductsClient";
import { HTTP_STATUS } from "@/constants";
import type { EnumProductType, IProduct } from "@/interfaces";
import { X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface SelectProps {
	options?: { value: string; label: string; disabled?: boolean }[];
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
	isUpdate?: boolean;
	label?: string;
}

const ProductSelector: React.FC<SelectProps> = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	name,
	isUpdate = false,
	label,
}) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [products, setProducts] = useState<
		{
			value: string;
			label: string;
			disabled?: boolean;
			productPart: EnumProductType;
		}[]
	>([]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const fetchProducts = async () => {
		setLoading(true);
		const resp = await ProductsClient.getAllProducts({
			signal: new AbortController().signal,
		});
		if (resp.status !== HTTP_STATUS.Ok) {
			setLoading(false);
			setProducts([]);
			toast.error("Lỗi khi lấy danh sách danh mục");
			return;
		}
		const filterOptions = resp?.data?.map((item: IProduct) => ({
			value: item.productId,
			label: item.productName + " - " + item.categoryName,
			disabled: !item.isActive,
			productPart: item.productPart,
		})) as {
			value: string;
			label: string;
			disabled?: boolean;
			productPart: EnumProductType;
		}[];
		setProducts(filterOptions || []);
		setLoading(false);
	};

	const handleOpen = async () => {
		setOpen(true);
		if (products.length === 0) {
			await fetchProducts();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleSelectOption = (option: {
		value: string;
		label: string;
		productPart: EnumProductType;
		disabled?: boolean;
	}) => {
		if (option.disabled) return;
		onChange(name, option.value);
		onChange("productPart", option.productPart);
		setInputValue("");
		setOpen(false);
	};

	const filteredOptions = useMemo(() => {
		return products.filter((product) =>
			product.label.toLowerCase().includes(inputValue.toLowerCase())
		);
	}, [products, inputValue]);

	const selectedOption = useMemo(() => {
		return products.find((option) => option.value === value);
	}, [products, value]);

	useEffect(() => {
		if (isUpdate) {
			(async () => {
				await fetchProducts();
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
							className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer z-10"
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

export default ProductSelector;
