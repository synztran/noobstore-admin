import { UPLOAD_API } from "@/constants";
import { POST } from ".";

export const postUploadImage = async (formData: FormData) => {
	const url = UPLOAD_API.IMAGE;
	return POST({
		url,
		body: formData,
		isAuth: true,
		contentType: "multipart/form-data",
	});
};

export default {
	postUploadImage,
};
