import { formatCurrency } from "@/utils/FormatNumber";

interface IProps {
	min: number;
	max: number;
	sale: number;
	handle: number;
	tax: number;
}

const PriceRangeBlock = ({ min, max, sale, handle, tax }: IProps) => {
	return (
		<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<span>Min:</span>{" "}
					<span className="font-bold">{formatCurrency(min)}</span>
				</div>
				<div className="flex items-center gap-2">
					<span>Max:</span>{" "}
					<span className="font-bold">{formatCurrency(max)}</span>
				</div>
			{sale ? (
				<div className="flex">
					<span>Sale:</span>&nbsp;
					<span className="font-bold">{formatCurrency(sale)}</span>
				</div>
			) : null}
			{handle ? (
				<div className="flex">
					<span>Handle:</span>&nbsp;
					<span className="font-bold">{handle}%</span>
				</div>
			) : null}
			{tax ? (
				<div className="flex">
					<span>Tax:</span>&nbsp;
					<span className="font-bold">{tax}%</span>
				</div>
			) : null}
		</div>
	);
};

export default PriceRangeBlock;
