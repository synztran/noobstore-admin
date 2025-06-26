import ValidateUtils from "./ValidateUtils";

export function formatCurrency(n: number, separate = ".", currency = "đ") {
	const num = ValidateUtils.isNumber(n) ? Number(n) : 0;
	const [integerPart, decimalPart] = num?.toFixed(0).split(".");
	const regex = /\B(?=(\d{3})+(?!\d))/g;
	let formattedInteger = integerPart?.replace(regex, separate);

	// Remove leading zero if present
	if (formattedInteger?.startsWith("0") && formattedInteger.length > 1) {
		formattedInteger = formattedInteger.substring(1);
	}

	const formattedNumber = decimalPart
		? `${formattedInteger}.${decimalPart}`
		: formattedInteger;
	const cur = currency || "";
	return formattedNumber + cur;
}

export function formatNumber(n: number, separate = ".") {
	const num = ValidateUtils.isNumber(n) ? n : 0;
	const s = String(num);
	const regex = /\B(?=(\d{3})+(?!\d))/g;
	return s.replace(regex, separate);
}

const numberWords = [
	"",
	"một",
	"hai",
	"ba",
	"bốn",
	"năm",
	"sáu",
	"bảy",
	"tám",
	"chín",
];

export function translateNumberToString(n: number): string {
	if (!ValidateUtils.isNumber(n) || n < 0) return "";

	const units = ["", "nghìn", "triệu", "tỷ"];
	let result = "";
	let unitIndex = 0;

	while (n > 0) {
		const part = n % 1000;
		if (part > 0) {
			result =
				`${translateThreeDigits(part)} ${units[unitIndex]} ${result}`.trim();
		}
		n = Math.floor(n / 1000);
		unitIndex++;
	}

	return result.trim() + " đồng";
}

function translateThreeDigits(n: number): string {
	const hundreds = Math.floor(n / 100);
	const tensAndUnits = n % 100;
	let result = "";

	if (hundreds > 0) {
		result += `${numberWords[hundreds]} trăm `;
	}

	if (tensAndUnits > 0) {
		if (tensAndUnits < 10) {
			result += `${numberWords[tensAndUnits]}`;
		} else {
			const tens = Math.floor(tensAndUnits / 10);
			const units = tensAndUnits % 10;

			if (tens > 1) {
				result += `${numberWords[tens]} mươi `;
			} else {
				result += "mười ";
			}

			if (units > 0) {
				if (units === 5 && tens > 0) {
					result += "lăm";
				} else {
					result += numberWords[units];
				}
			}
		}
	}

	return result.trim();
}

export function checkUsedServiceAddonPrice({
	isPercent = false,
	productPrice = 0, // salePrice || ogPrice,
	servicePrice = 0,
	minServicePrice = 0,
}: {
	isPercent?: boolean;
	productPrice?: number;
	servicePrice?: number;
	minServicePrice?: number;
}) {
	const percentPrice = productPrice * (servicePrice / 100);
	console.log("percentPrice", percentPrice, productPrice, minServicePrice);
	if (isPercent && percentPrice > minServicePrice) {
		return percentPrice;
	}
	return minServicePrice;
}
