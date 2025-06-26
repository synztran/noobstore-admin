import { getFirst } from "@/client";
import { postUploadImage } from "@/client/UploadClient";
import { UploadStatusProperty } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/images";
import type { IResponse } from "@/interfaces";
import { EnumUploadStatus } from "@/interfaces";
import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface IUploadImageProps {
	allowMultiple?: boolean;
	acceptedFileTypes?: string[];
	label?: string;
	errorMessage?: string;
	files?: UploadedImage[];
	handleSyncData?: (files: { publicUrl: string; size: number }) => void;
	max?: number;
	thumbnailUploaded?: string[];
}

export interface UploadedImage {
	file?: File;
	preview: string;
	status: EnumUploadStatus;
	publicUrl?: string;
}

interface IImageData {
	bytes: number;
	created_at: string;
	public_id: string;
	url: string;
}

const UploadImage: React.FC<IUploadImageProps> = ({
	allowMultiple = false,
	acceptedFileTypes = [],
	label = "Tải lên ảnh",
	errorMessage = "",
	files = [],
	handleSyncData,
	max = 1,
	thumbnailUploaded,
}) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
		() => {
			if (thumbnailUploaded) {
				return [
					{
						preview: thumbnailUploaded?.[0] || "",
						status: EnumUploadStatus.DONE,
						publicUrl: thumbnailUploaded?.[0] || "",
					},
				];
			}
			return files;
		}
	);

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.preventDefault();
		const selectedFiles = event.target.files;
		if (!selectedFiles) return;

		// Check if adding new files would exceed the max limit
		if (uploadedImages.length + selectedFiles.length > max) {
			toast.error(`Chỉ được phép tải lên tối đa ${max} ảnh`);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		const newImages: UploadedImage[] = Array.from(selectedFiles).map(
			(file) => ({
				file,
				preview: URL.createObjectURL(file),
				status: EnumUploadStatus.UPLOADING,
			})
		);

		setUploadedImages((prev) => [...prev, ...newImages]);

		// Upload images using API
		try {
			const uploadPromises: Promise<IResponse<IImageData>>[] = Array.from(
				selectedFiles
			).map(async (file) => {
				const formData = new FormData();
				formData.append("files", file);
				const response = await postUploadImage(formData);

				if (response.status !== "OK") {
					toast.error("Có lỗi xảy ra. Không thể tải lên ảnh");
					setUploadedImages((prev) =>
						prev.map((img) => ({
							...img,
							status: EnumUploadStatus.ERROR,
						}))
					);
				}
				return response;
			});

			const results = await Promise.all(uploadPromises);
			if (results.some((result) => result.status !== "OK")) {
				toast.error("Có lỗi xảy ra. Không thể tải lên ảnh");
				setUploadedImages((prev) =>
					prev.map((img) => ({
						...img,
						status: EnumUploadStatus.ERROR,
					}))
				);
				return;
			}
			const firstData = results?.[0];
			if (!firstData) {
				toast.error("Có lỗi xảy ra. Không thể tải lên ảnh");
				setUploadedImages((prev) =>
					prev.map((img) => ({
						...img,
						status: EnumUploadStatus.ERROR,
					}))
				);
				return;
			}
			const resultData = getFirst(firstData);

			setUploadedImages((prev) =>
				prev.map((img) => ({
					...img,
					status: EnumUploadStatus.DONE,
					publicUrl: (resultData as IImageData)?.url,
				}))
			);

			const listImages = {
				publicUrl: (resultData as IImageData)?.url || "",
				size: (resultData as IImageData)?.bytes || 0,
			};

			handleSyncData && handleSyncData(listImages);
			toast.success("Tải ảnh lên thành công");
		} catch (error) {
			toast.error("Có lỗi xảy ra. Không thể tải lên ảnh");
			setUploadedImages((prev) =>
				prev.map((img) => ({
					...img,
					status: EnumUploadStatus.ERROR,
				}))
			);
		}
	};

	const handleRemoveImage = (index: number) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="flex flex-col mt-2 border p-4 relative min-w-[15vw] w-full h-full rounded-[4px] justify-center">
			{/* <div className="text-base text-gray-500">{label}</div> */}
			<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
				{label}
			</label>
			<button
				className="btn btn-md max-w-max text-white bg-red-400 rounded-lg p-4 cursor-pointer text-center"
				onClick={() => fileInputRef.current?.click()}>
				Tải lên ảnh
			</button>
			{acceptedFileTypes?.length ? (
				<span className="ml-2 text-sm text-gray-500">
					Định dạng file ảnh{" "}
					<strong>
						{acceptedFileTypes
							.toString()
							.trim()
							.replace(/,/g, ", ")}
					</strong>
				</span>
			) : null}
			<input
				id="file-upload"
				type="file"
				accept={
					acceptedFileTypes?.join(",") || ".jpg,.jpeg,.png,.gif,.webp"
				}
				multiple={allowMultiple}
				onChange={handleImageUpload}
				style={{ display: "none" }}
				ref={fileInputRef}
			/>
			{uploadedImages?.length ? (
				<BlockImageUploaded
					uploadedImages={uploadedImages}
					handleRemoveImage={handleRemoveImage}
				/>
			) : null}
			{errorMessage ? (
				<span className="text-red-500">{errorMessage}</span>
			) : null}
		</div>
	);
};

export default UploadImage;

interface IBlockImageUploaded {
	uploadedImages: UploadedImage[];
	handleRemoveImage?: (index: number) => void;
}

const BlockImageUploaded = ({
	uploadedImages,
	handleRemoveImage,
}: IBlockImageUploaded) => {
	return (
		<div style={{ marginTop: "20px" }}>
			<label>Ảnh đã tải lên:</label>
			<div className="flex gap-4">
				{uploadedImages.map((image, index) => (
					<div key={index} className="flex flex-col justify-between">
						<div className="relative max-w-max">
							{image.status === EnumUploadStatus.DONE && (
								<X
									className="absolute -top-2 -right-2 cursor-pointer z-10 text-black bg-white rounded-full p-1 border border-gray-600 hover:scale-110 transform transition-transform duration-200"
									onClick={() => handleRemoveImage?.(index)}
								/>
							)}
							<div className="relative">
								<img
									src={image.preview || NEW_MISSING_IMAGE}
									alt={`Uploaded ${index}`}
									width={120}
									height={120}
									className="rounded-lg cursor-pointer"
									style={{
										maxWidth: "100%",
										height: "auto",
									}}
									sizes="100vw"
								/>
								{image.status ===
									EnumUploadStatus.UPLOADING && (
									<div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
										<div className="loading loading-md text-green-400" />
									</div>
								)}
								{image.status === EnumUploadStatus.ERROR && (
									<div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
										<span className="text-red-500 bg-[rgba(0,0,0,0.5)] text-sm font-bold">
											Có lỗi xảy ra
										</span>
									</div>
								)}
							</div>
						</div>
						<div className="mt-auto">
							<div className="max-w-[120px]">
								<span className="block font-bold text-sm mt-2 truncate w-[120px]">
									{image?.file?.name || "Thumbnail"}
								</span>
							</div>
							<span
								className={`${
									UploadStatusProperty[image.status]?.color
								} flex items-center gap-1 text-xs`}>
								{UploadStatusProperty[image.status]?.icon}
								{UploadStatusProperty[image.status]?.text}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
