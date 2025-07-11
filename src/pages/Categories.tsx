import { getData, isValid } from "@/client";
import CategoryClient from "@/client/CategoryClient";
import {
	EnumCategorySaleType,
	EnumCategoryType,
	EnumSaleStatus,
	type ICategory,
	type IResponse,
} from "@/interfaces";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { categoryValidationSchema } from "@/validates/categories";
import { HTTP_STATUS, MapCategoryStatus } from "@/constants";
import { Link } from "react-router-dom";
import { Settings, Share2, Trash2 } from "lucide-react";
import PriceRangeBlock from "@/components/PriceRangeBlock";
import CategoryForm from "@/components/Category/Form";
import { NEW_MISSING_IMAGE } from "@/images";

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
		id: "categoryName",
		label: "Tên",
	},
	{
		id: "description",
		label: "Mô tả",
	},
	{
		id: "isActive",
		label: "Trạng thái - Hiển thị",
	},
	{
		id: "price",
		label: "Giá - Tồn",
    styles: {
      width: 200,
    }
	},
	{
		id: "actions",
		label: "",
	},
];

const Categories: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [targetEdit, setTargetEdit] = useState<ICategory | null>(null);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [fetching, setFetching] = useState<boolean>(false);
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			categoryId: targetEdit?.categoryId || "",
			categoryName: targetEdit?.categoryName || "",
			description: targetEdit?.description || "",
			isActive: targetEdit?.isActive || false,
			minPrice: targetEdit?.minPrice || 0,
			maxPrice: targetEdit?.maxPrice || 0,
			saleType: targetEdit?.saleType || EnumCategorySaleType.ABSOLUTE,
			saleValue: targetEdit?.salePrice || 0,
			content: targetEdit?.content || "",
			tax: targetEdit?.tax || 0,
			handle: targetEdit?.handle || 0,
			thumbnail: targetEdit?.thumbnail || null,
			status: targetEdit?.status || EnumSaleStatus.INSTOCK,
			type: targetEdit?.type || EnumCategoryType.KEYBOARD,
			collapseContent: targetEdit?.collapseContent || [],
		} as ICategory,
		validationSchema: categoryValidationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			if (targetEdit) {
				handleUpdate(values);
			} else {
				handleCreate(values);
			}
		},
	});

	const handleCreate = async (payload: ICategory) => {
		const signal = new AbortController().signal;
		const response = await CategoryClient.postCreateCategory({
			body: payload,
			signal: signal,
		});

		if (response.status === HTTP_STATUS.Ok) {
			toast.success("Tạo mới thành công");
			formik.resetForm();
			setOpen(false);
      setTriggerRefetch(true)
      setTargetEdit(null)
		} else {
			toast.error("Tạo mới thất bại");
		}
	};

	const handleUpdate = async (payload: ICategory) => {
		const signal = new AbortController().signal;
		const response = await CategoryClient.postUpdateCategory({
			body: payload,
			signal: signal,
		});

		if (response.status === HTTP_STATUS.Ok) {
			toast.success("Cập nhật thành công");
			formik.resetForm();
      setTargetEdit(null)
			setOpen(false);
      setTriggerRefetch(true)
		} else {
			toast.error("Cập nhật thất bại");
		}
	};

	const handleEdit = (category: ICategory) => {
		console.log("category", category);
		setTargetEdit(category);
		setOpen(true);
	};

	const handleCloseModal = () => {
		setOpen(false);
		setTargetEdit(null);
	};

	useEffect(() => {
    (async () => {
      setFetching(true);
      const signal = AbortSignal.timeout(10000);
      const params = {
        status: EnumSaleStatus.ALL,
        isValid: false,
      };
      const response: IResponse<ICategory> =
        await CategoryClient.getAllCategory({
          params,
          signal,
        });
      if (!isValid(response)) {
        toast.error(response.message);
        setCategories([]);
      }
      setCategories(getData(response) || []);
      setFetching(false);
    })();

    return () => {
      setTriggerRefetch(false)
    }
	}, [triggerRefetch]);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Categories</h1>
					<p className="text-base-content/70">
						Manage your store categories
					</p>
				</div>
				<button
					className="btn btn-primary"
					onClick={() => setOpen(true)}>
					Add new
				</button>
			</div>

			<div className="card bg-base-200 shadow">
				<div className="card-body">
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							<thead>
								<tr>
									{tableColumns.map((column) => (
										<th key={column.id} style={column?.styles}>{column.label}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{fetching ? (
									<tr>
										<td colSpan={3}>Loading...</td>
									</tr>
								) : null}
								{categories.map((category) => (
									<tr key={category.categoryId}>
                    <td>
                      <div className="flex flex-col gap-2">
                        <img
                          src={category.thumbnail?.path || NEW_MISSING_IMAGE}
                          alt={category.categoryName}
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
													{category.categoryId}
												</div>
												<div>
													<span className="font-bold">
														Slug:
													</span>{" "}
													{category.slug}
												</div>
												<div></div>
											</div>
										</td>
										<td>
											<div className="flex flex-col gap-2">
												<span>
													{category.categoryName}
												</span>
												<Link
													target="_blank"
													to={`/shop/${category.slug}`}
													className="hover:underline">
													<span className="flex gap-2 items-center">
														Shop link
														<Share2
															className="!w-6 !h-6"
															style={{
																transform:
																	"scaleX(-1)",
															}}
														/>
													</span>
												</Link>
											</div>
										</td>
										<td className="line-clamp-3 table-cell">{category.description}</td>
										<td className="flex flex-col gap-2 items-center">
											<input
												type="checkbox"
												className="toggle"
												checked={category.isActive}
												onChange={() =>
													formik.setFieldValue(
														"isActive",
														!category.isActive
													)
												}
											/>
											<span
												className={`badge badge-primary`}>
												{
													MapCategoryStatus[
														category.status as EnumSaleStatus
													]?.label
												}
											</span>
										</td>
										<td>
											<PriceRangeBlock
												min={category.minPrice}
												max={category.maxPrice}
												handle={category.handle}
												tax={category.tax}
												sale={category.salePrice || 0}
											/>
										</td>
										<td>
											<div className="flex flex-col space-y-2">
												<button
													className="btn max-w-max max-h-max btn-outline !p-0.5"
													onClick={() =>
														handleEdit(category)
													}>
													<Settings className="w-5 h-5" />
												</button>
												<button className="btn max-w-max max-h-max btn-error !p-0.5">
													<Trash2 className="w-5 h-5" />
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
			<CategoryForm
				formik={formik}
				targetEdit={targetEdit}
				open={open}
				onClose={handleCloseModal}
				onSubmit={() => console.log(1)}
			/>
		</div>
	);
};

export default Categories;
