import { getData, isValid } from "@/client";
import ProductsClient from "@/client/ProductsClient";
import NewProduct from "@/components/Product/Form";
import { HTTP_STATUS } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/images";
import {
	EnumProductType,
	EnumSaleStatus,
	type IProduct,
	type IProductOption,
} from "@/interfaces";
import { productValidationSchema } from "@/validates/categories";
import { useFormik } from "formik";
import { Ban, Check, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const tableColumns: {
	id: string;
	label: string;
	styles?: React.CSSProperties;
}[] = [
  {
    id: "thumbnail",
    label: "Ảnh",
  },
	{
		id: "categoryId",
		label: "#",
	},
	{
		id: "productName",
		label: "Tên",
	},
	{
		id: "optionProducts",
		label: "Product options",
	},
	{
		id: "isActive",
		label: "Hiện thị - Trạng thái",
	},
	// {
	// 	id: "price",
	// 	label: "Giá - Tồn",
	// },
	{
		id: "actions",
		label: "",
	},
];

const Products: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [targetProduct, setTargetProduct] = useState<IProduct | null>(null);
	const [products, setProducts] = useState<IProduct[]>([]);
	const [productOptions, setProductOptions] = useState<IProductOption[]>([]);
	const [isLoading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const signal = new AbortController().signal;
			const response = await ProductsClient.getAllProducts({ signal });
			console.log("response", response)
			if (!isValid(response)) {
				toast.error("Có lỗi xảy ra trong quá trình lấy dữ liệu");
				return;
			}
			const respProductOptions = await ProductsClient.getProductOptions({
				body: {
					productId: "",
					productPart: EnumProductType.ETC,
					productOptionIds: [],
				},
				signal,
			});
			if (!isValid(respProductOptions)) {
				toast.error("Có lỗi xảy ra trong quá trình lấy dữ liệu");
				return;
			}

			setProductOptions(getData(respProductOptions) ?? []);
			setProducts(getData(response) ?? []);
			setLoading(false);
		})();
	}, []);

  console.log("targetProduct", targetProduct)

	const formik = useFormik({
		initialValues: {
			productId: targetProduct?.productId ?? "",
			categoryId: targetProduct?.categoryId ?? "",
			productName: targetProduct?.productName ?? "",
			slug: targetProduct?.slug ?? "",
			productPart: targetProduct?.productPart ?? EnumProductType.ETC,
			isActive: targetProduct?.isActive ?? false,
			price: targetProduct?.price ?? 0,
			salePrice: targetProduct?.salePrice ?? 0,
			thumbnail: targetProduct?.thumbnail ?? null,
			images: targetProduct?.images ?? [],
			description: targetProduct?.description ?? "",
			productType: targetProduct?.productPart ?? "",
			optionGroups: {
				groupName: targetProduct?.optionGroups?.groupName ?? "",
				isRequired: targetProduct?.optionGroups?.isRequired ?? false,
				isMultiple: targetProduct?.optionGroups?.isMultiple ?? false,
				optionIds: targetProduct?.optionGroups?.optionIds ?? [],
			},
			weight: 0,
			quantity: 0,
			status: EnumSaleStatus.INSTOCK,
			replaceProductName: "",
			isMultiple: false,
			isRequired: false,
		} as IProduct,
		validationSchema: productValidationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			if (targetProduct) {
				handleUpdateProduct(values);
			} else {
				handleCreateProduct(values);
			}
		},
	});

	const handleCreateProduct = async (payload: IProduct) => {
		const signal = new AbortController().signal;
		const resp = await ProductsClient.postNewProduct({
			body: {
				...payload,
				optionGroups: {
					groupName: payload.productPart,
					isRequired: payload.isRequired ?? false,
					isMultiple: payload.isMultiple ?? false,
					optionIds: payload.optionGroups.optionIds,
				},
			},
			signal,
		});

		if (resp.status === HTTP_STATUS.Ok) {
			toast.success("Tạo mới sản phẩm thành công");
			formik.resetForm();
			setOpen(false);
			if (targetProduct) {
				setTargetProduct(null);
			}
		} else {
			toast.error("Có lỗi xảy ra trong quá trình tạo mới");
		}
	};

	const handleUpdateProduct = async (payload: IProduct) => {
		const signal = new AbortController().signal;
		const resp = await ProductsClient.putUpdateProduct({
			body: payload,
			signal,
		});

		if (resp.status === HTTP_STATUS.Ok) {
			toast.success("Cập nhật sản phẩm thành công");
			formik.resetForm();
			setOpen(false);
			setTargetProduct(null);
		} else {
			toast.error("Có lỗi xảy ra trong quá trình cập nhật");
		}
	};

	const handleEditProduct = (product: IProduct) => {
		setTargetProduct(product);
		setOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Products</h1>
					<p className="text-base-content/70">
						Manage your store products
					</p>
				</div>
				<button
					className="btn btn-primary"
					onClick={() => setOpen(true)}>
					+ Add new
				</button>
			</div>

			<div className="card bg-base-200 shadow">
				<div className="card-body">
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							<thead>
								<tr>
									{tableColumns.map((column) => (
										<th key={column.id}>{column.label}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<tr>
										<td colSpan={3}>Loading...</td>
									</tr>
								) : null}
								{products.map((product) => (
									<tr key={product.productId}>
                    <td>
                      <div className="flex flex-col gap-2">
                        <img
                          src={product.thumbnail?.path || NEW_MISSING_IMAGE}
                          alt={product.productName}
                          width={100}
                          height={100}
                        />
                      </div>
                    </td>
										<td>
											<div className="flex flex-col gap-2">
												<div>
													<span className="font-bold">
														ID:
													</span>{" "}
													{product.productId}
												</div>
												{product?.productPart
													 ? (
													<div>
														<span className="font-bold">
															Product part:
														</span>{" "}
														<span className="rounded-md bg-gray-600 text-white p-1">
															{
																product.productPart
															}
														</span>
													</div>
												) : null}
											</div>
										</td>
										<td>
											<div className="flex flex-col gap-2">
												<span>
													{product.productName}
												</span>
												<span>
													{product.replaceProductName}
												</span>
											</div>
										</td>
										<td>
											<div className="flex flex-col gap-2">
												<ul>
													{product?.optionGroups.optionIds?.map(
														(item) => (
															<li key={item}>
																{
																	productOptions?.find(
																		(
																			option
																		) =>
																			option.id ===
																			item
																	)?.name
																}
																&nbsp;- {item}
															</li>
														)
													)}
												</ul>
											</div>
										</td>
										<td>
											<div className="flex flex-col gap-2">
												<div className="flex gap-4 items-center">
													<span className="font-bold">
														Ẩn
													</span>
													<input
														type="checkbox"
														className="toggle toggle-primary"
														checked={
															product.isActive
														}
														readOnly
													/>
													<span className="font-bold">
														Hiện
													</span>
												</div>
												<div className="flex flex-col gap-2">
													<div className="flex items-center gap-4">
														<span className="font-bold">
															Required:
														</span>{" "}
														{product.optionGroups
															.isRequired ? (
															<Check className="text-green-500 w-5 h-5" />
														) : (
															<Ban className="text-red-500 w-5 h-5" />
														)}
													</div>
													<div className="flex items-center gap-4">
														<span className="font-bold">
															Multiple:
														</span>{" "}
														{product.optionGroups
															.isMultiple ? (
															<Check className="text-green-500 w-5 h-5" />
														) : (
															<Ban className="text-red-500 w-5 h-5" />
														)}
													</div>
												</div>
											</div>
										</td>
										<td>
											<div className="flex flex-col gap-2">
												<button
													className="btn max-w-max max-h-max !p-0.5 btn-outline"
													onClick={() =>
														handleEditProduct(
															product
														)
													}>
													<Edit />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<NewProduct
				formik={formik}
				open={open}
				onClose={() => setOpen(false)}
				isEdit={!!targetProduct}
			/>
		</div>
	);
};

export default Products;
