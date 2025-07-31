import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface IOptionSelection {
	value: string;
	label: string;
	index: number;
}

interface IProps {
	name: string;
	options: IOptionSelection[];
	onSelect: ({
		name,
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
	}) => void;
	onAddNew: ({
		name,
		newOption,
	}: {
		name: string;
		newOption: IOptionSelection;
	}) => void;
	placeholder?: string;
	className?: string;
	label: string;
	isAddOn?: boolean;
}

// SearchableSelect Component
const SearchableSelect: React.FC<IProps> = ({
	options = [],
	onSelect,
	onAddNew,
	placeholder = "Search or add new...",
	className = "",
	label = "",
	name = "",
	isAddOn = false,
}: IProps) => {
	const [isOpen, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [isAdding, setAdding] = useState(false);
	const [newOption, setNewOption] = useState<string>("");
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(search.toLowerCase())
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setOpen(false);
				setAdding(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (name: string, option: IOptionSelection) => {
		onSelect({ name, option });
		setSearch(option.label);
		setOpen(false);
	};

	const handleAddNew = () => {
		if (newOption.trim()) {
			const formatNewOption = {
				value: newOption.trim(),
				label: newOption,
				index: options.length + 1,
			};
			onAddNew({ name, newOption: formatNewOption });
			setSearch(newOption.trim());
			setNewOption("");
			setAdding(false);
			setOpen(false);
		}
	};

	return (
		<div className={`w-full relative ${className}`} ref={wrapperRef}>
			<div className="relative">
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
				</label>
				<input
					type="text"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setOpen(true);
					}}
					autoComplete="off"
					onFocus={() => setOpen(true)}
					placeholder={placeholder}
					className="input input-bordered w-full pr-10 text-sm"
				/>
				<button
					type="button"
					tabIndex={-1}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
					onClick={() => setOpen(!isOpen)}>
					<ChevronsUpDown size={16} />
				</button>
			</div>

			{isOpen && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
					{filteredOptions.length > 0 ? (
						<ul className="py-1">
							{filteredOptions.map((option, index) => (
								<li
									key={index}
									className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
										search === option.label
											? "bg-gray-50"
											: ""
									}`}
									onClick={() => handleSelect(name, option)}>
									<span>{option.label}</span>
									{search === option.label && (
										<Check
											size={16}
											className="text-green-500"
										/>
									)}
								</li>
							))}
						</ul>
					) : (
						<div className="p-2">
							{isAdding ? (
								<div className="space-y-2">
									<input
										autoFocus
										value={newOption}
										onChange={(e) =>
											setNewOption(e.target.value)
										}
										placeholder="Nhập vào tên phím mới..."
										className="input input-bordered w-full text-sm"
									/>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={handleAddNew}
											disabled={!newOption.trim()}
											className={`btn btn-primary w-full capitalize flex items-center gap-2 ${
												!newOption.trim()
													? "btn-disabled"
													: ""
											}`}>
											<Check size={16} className="mr-1" />
											Thêm
										</button>
										<button
											type="button"
											onClick={() => {
												setAdding(false);
												setNewOption("");
											}}
											className="btn btn-outline w-full capitalize flex items-center gap-2">
											<X size={16} className="mr-1" />
											Hủy
										</button>
									</div>
								</div>
							) : (
								<button
									type="button"
									className={`btn btn-ghost w-full justify-start text-gray-600 capitalize flex items-center`}
									onClick={() => {
										if (isAddOn) {
											setAdding(true);
											setNewOption(search);
										}
									}}>
									{isAddOn ? (
										<>
											<Plus size={16} className="mr-2" />
											Thêm "{search}"
										</>
									) : (
										<span>
											Không tìm thấy kết quả với "{search}
											"
										</span>
									)}
								</button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchableSelect;
