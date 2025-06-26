import { toast } from "react-toastify";
import { hashCode } from "./StringUtils";

const show = (text, type, options) => {
	// create toastId
	const toastId = hashCode(`${text}-${Date.now()}`);

	// prevent duplicate message
	if (toast.isActive(toastId)) {
		toast.update(toastId, { autoClose: 1500 });
	} else {
		toast(text, {
			toastId,
			type,
			position: "bottom-right",
			...options,
		});
	}
};

const info = (text) => {
	show(text, "info");
};

const success = (text) => {
	show(text, "success");
};

const dark = (text) => {
	show(text, "dark");
};

const error = (text, options) => {
	show(text, "error", options);
};

const warn = (text) => {
	show(text, "warn");
};

export default { info, success, dark, error, warn };
