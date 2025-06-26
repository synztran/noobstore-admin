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
			<div className="flex flex-col">
				<span className="font-bold">Min - Max:</span>{" "}
				{formatCurrency(min)} - {formatCurrency(max)}
			</div>
			{sale ? (
				<div className="flex">
					<span className="font-bold">Sale:</span>&nbsp;
					{formatCurrency(sale)}
				</div>
			) : null}
			{handle ? (
				<div className="flex">
					<span className="font-bold">Handle:</span>&nbsp;
					{handle}%
				</div>
			) : null}
			{tax ? (
				<div className="flex">
					<span className="font-bold">Tax:</span>&nbsp;
					{tax}%
				</div>
			) : null}
		</div>
	);
};

export default PriceRangeBlock;
