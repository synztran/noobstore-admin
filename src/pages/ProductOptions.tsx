import ProductsClient from "@/client/ProductsClient";
import NewProductOption from "@/components/ProductOption/NewForm";
import { HTTP_STATUS, ProductOptStatus } from "@/constants";
import { EnumProductOptStatus, EnumProductType, type IProductOption } from "@/interfaces";
import { formatCurrency } from "@/utils/FormatNumber";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const tableColumns: {
	id: string;
	label: string;
	styles?: React.CSSProperties;
}[] = [
  {
    id: "thumbnail",
    label: "Ảnh",
    styles:{
      maxWidth: "60px" as const,
    }
  },
	{
		id: "categoryId",
		label: "#",
	},
	{
		id: "belongTo",
		label: "Thuộc sản phẩm",
	},
  {
		id: "description",
		label: "Mô tả",
	},
	{
		id: "isActive",
		label: "Giá - Trạng thái - Tồn",
    styles: {
      textAlign: "center" as const,
      width: "300px" as const,
    }
	},
	// {
	// 	id: "price",
	// 	label: "Giá - Tồn",
	// },
	{
		id: "actions",
		label: "Thao tác",
    styles:{
      maxWidth: 40,
      textAlign: "center" as const,
    }
	},
];

export default function ProductOptionsPage() {
	const [open, setOpen] = useState<boolean>(false);
  const [productOptions, setProductOptions] = useState<IProductOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false);

	const handleDeleteProduct = (id: string) => {
    console.log(id)
	};

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const res = await ProductsClient.getProductOptions({
        body: {
          productId: "",
          productPart: EnumProductType.ETC,
          productOptionIds: [],
        },
        signal: new AbortController().signal,
      })
      if (res.status !== HTTP_STATUS.Ok)  {
        toast.error(res.message)
        return;
      }

      setProductOptions(res.data || [])
      setIsLoading(false)
    })()
  }, [triggerRefetch])

	return (
		<>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold mb-4">Product Option</h1>
				<button className="btn btn-primary" onClick={() => setOpen(true)}>
					+ Tạo mới
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							{tableColumns.map((column) => (
								<th key={column.id} style={column?.styles}>
									<div className="font-bold">
										{column.label}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={3}>Loading...</td>
							</tr>
						) : null}
						{productOptions?.map((product) => (
							<tr key={product?.id}>
                <td>
                  <div className="flex flex-col gap-2">
                    <img src={product?.thumbnail} alt={product?.name} className="w-18 h-18 object-cover" />
                  </div>
                </td>
								<td>
									<div className="flex flex-col gap-2">
										<div>
											<span className="font-bold">
												ID:
											</span>{" "}
											{product?.id}
										</div>
										<div>
											<span className="font-bold">
												Tên Option:
											</span>{" "}
											{product?.name}
										</div>
										<div>
											<span className="font-bold">
												Product Part:
											</span>{" "}
											<span className="bg-gray-600 p-1 rounded-md text-white">
												{product?.productPart}
											</span>
										</div>
									</div>
								</td>
								<td>
								</td>
								<td>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product?.description || "",
                    }}
                  />
								</td>
								<td className="flex flex-col gap-4">
									<div className="flex items-center justify-between">
										<strong className="">Trạng thái</strong>
										<span className={`badge text-black font-bold ${ProductOptStatus[product?.status || EnumProductOptStatus.INSTOCK].value === EnumProductOptStatus.INSTOCK ? `badge-success` : `badge-error`} `}>{ProductOptStatus[product?.status || EnumProductOptStatus.INSTOCK].label}</span>
									</div>
                  <div className="flex items-center justify-between">
										<strong className="">Hiển thị</strong>
										<div className="flex items-center justify-center">
											<input
												type="checkbox"
												className="toggle toggle-primary"
												checked={
													product?.status ===
													EnumProductOptStatus.INSTOCK
												}
                        onChange={() => {
                          console.log("change")
                        }}
											/>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<strong>Tồn: </strong>
										<span className="badge badge-outline">
											{product?.quantity}
										</span>
									</div>
                  <div className="flex items-center justify-between gap-2">
										<div>
											<span className="font-bold">
												Giá:
											</span>{" "}
											{formatCurrency(
												product?.price || 0
											)}
										</div>
										<div>
											<span className="font-bold">
												Giá KM:
											</span>{" "}
											<strong className="text-red-500 text-base">
												{formatCurrency(
													product?.salePrice || 0
												)}
											</strong>
										</div>
									</div>
								</td>
								<td>
									<div className="flex flex-col gap-4">
										<button className="btn btn-ghost btn-sm p-0 min-w-5">
											<Edit2 className="!w-5 !h-5" />
										</button>
										<button
											className="btn btn-ghost btn-sm p-0 min-w-5"
											onClick={() =>
												handleDeleteProduct(
													product?.id as string
												)
											}>
											<Trash2 className="!w-5 !h-5 text-red-400" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<NewProductOption open={open} onClose={() => setOpen(!open)} onSuccess={() => setTriggerRefetch(!triggerRefetch)} />
		</>
	);
}
