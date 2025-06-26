import ProductsClient from "@/client/ProductsClient";
import { HTTP_STATUS } from "@/constants";
import type { IProduct } from "@/interfaces";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	// options?: { value: string; label: string }[];
	categoryId: string;
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
	isUpdate?: boolean;
	label?: string;
}

const ProductSelection: React.FC<IProps> = ({
	// options,
	categoryId,
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
		}[]
	>([]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const fetchProducts = async () => {
		setLoading(true);
		const resp = await ProductsClient.getAllProductsByCategory({
			params: {
				categoryId,
			},
			signal: new AbortController().signal,
		});
		if (resp.status !== HTTP_STATUS.Ok) {
			setLoading(false);
			setProducts([]);
			toast.error("Lỗi khi lấy danh sách sản phẩm");
			return;
		}
		const filters = resp?.data?.map((item: IProduct) => ({
			value: item.productId,
			label: item.productId + " - " + item.productName,
			disabled: !item.isActive,
		})) as {
			value: string;
			label: string;
			disabled?: boolean;
		}[];
		setProducts(filters || []);
		setLoading(false);
	};

	const handleOpen = async () => {
		setOpen(true);
		await fetchProducts();
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

	const filteredOptions = products.filter((option) =>
		option.label.toLowerCase().includes(inputValue.toLowerCase())
	);

	const selectedOption = products.find((option) => option.value === value);

	useEffect(() => {
		if (isUpdate) {
			(async () => {
				await fetchProducts();
			})();
		}
	}, [isUpdate, categoryId]);

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
					placeholder={placeholder || "Chọn sản phẩm"}
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
							<span className="ml-2">Đang tải sản phẩm...</span>
						</li>
					) : filteredOptions.length === 0 ? (
						<li className="text-center py-2 text-base-content/60">
							Không có sản phẩm theo từ khóa này
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

export default ProductSelection;
