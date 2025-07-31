import React, { useState } from "react";
import NewProductOption from ".";
import type { IProductOption } from "@/interfaces";
import { EnumProductOptStatus, EnumProductType } from "@/interfaces";
import { HTTP_STATUS } from "@/constants";
import ProductOptionsClient from "@/client/ProductOptionsClient";
import toast from "react-hot-toast";

interface IProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const getDefaultOption = (): IProductOption => ({
	name: "",
	isActive: false,
	price: 0,
	salePrice: 0,
	thumbnail: "",
	description: "",
	quantity: 0,
	productPart: EnumProductType.ETC,
	status: EnumProductOptStatus.INSTOCK,
	productId: "",
});

const MultiNewProductOption: React.FC<IProps> = ({
	open,
	onClose,
	onSuccess,
}) => {
	const [options, setOptions] = useState<IProductOption[]>([
		getDefaultOption(),
	]);
	const [loading, setLoading] = useState(false);

	const handleChange = (idx: number, name: string, value: any) => {
		setOptions((prev) => {
			const next = [...prev];
			(next[idx] as any)[name] = value;
			return next;
		});
	};

	const handleAdd = () => {
		setOptions((prev) => [...prev, getDefaultOption()]);
	};

	const handleRemove = (idx: number) => {
		setOptions((prev) =>
			prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		let allSuccess = true;
		for (const values of options) {
			const resp = await ProductOptionsClient.postNewProductOption({
				body: { ...values, thumbnail: values.thumbnail ?? "" },
				signal: new AbortController().signal,
			});
			if (resp.status !== HTTP_STATUS.Ok) {
				allSuccess = false;
				toast.error("Có lỗi xảy ra khi tạo một option");
			}
		}
		setLoading(false);
		if (allSuccess) {
			toast.success("Tạo mới thành công tất cả option");
			setOptions([getDefaultOption()]);
			onClose();
			onSuccess();
		}
	};

	return (
		<dialog className={`modal ${open ? "modal-open" : ""}`}>
			<div className="modal-box max-w-[max(40vw,600px)]">
				<h3 className="font-bold text-2xl mb-4">
					Tạo nhiều Product Option
				</h3>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
						{options.map((option, idx) => (
							<div
								key={idx}
								className="relative border rounded p-4 bg-base-100">
								<button
									type="button"
									className="btn btn-xs btn-circle btn-error absolute top-2 right-2"
									onClick={() => handleRemove(idx)}
									disabled={options.length === 1}
									title="Xóa option này">
									×
								</button>
								<NewProductOption
									open={true}
									onClose={() => {}}
									onSuccess={() => {}}
									// @ts-ignore
									formikOverride={{
										values: option,
										setFieldValue: (
											name: string,
											value: any
										) => handleChange(idx, name, value),
									}}
									isMulti
								/>
							</div>
						))}
					</div>
					<div className="flex justify-between items-center mt-4">
						<button
							type="button"
							className="btn btn-outline"
							onClick={handleAdd}>
							+ Thêm option
						</button>
						<div>
							<button
								type="button"
								className="btn btn-secondary mr-2"
								onClick={onClose}>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={loading}>
								{loading ? "Đang tạo..." : "Tạo tất cả"}
							</button>
						</div>
					</div>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>close</button>
			</form>
		</dialog>
	);
};

export default MultiNewProductOption;
