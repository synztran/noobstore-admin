/* eslint-disable no-param-reassign */
import { MISSING_IMAGE } from "@/constants/Images";
import Image from "next/image";
import { useState } from "react";
// import { getLinkCacheFromGG, getLinkFallbackCDN, getLinkFallbackCacheImage, getLinkImageStatic } from './CacheImageUtils';
// import { getLinkCacheProxy, getLinkProxyCDN, getLinkProxyFile } from './ImageUtils';
// import myLoader, {
// 	myLoaderCacheCDN,
// 	myLoaderCacheInstant,
// 	myLoaderCacheProxy,
// } from "./myLoader";

const ImageFallback = ({
	src,
	fallbackSrc,
	loading = "eager",
	isUseLoader = true,
	isUseLoaderCache = false,
	isUseLoaderCacheProxy = false,
	isUseLoaderCdn = false,
	...rest
}) => {
	const [imgSrc, setImgSrc] = useState(false);
	const [oldSrc, setOldSrc] = useState(src);
	if (oldSrc !== src) {
		if (isUseLoaderCache || isUseLoaderCacheProxy || isUseLoaderCdn) {
			isUseLoaderCache = false;
			isUseLoaderCacheProxy = false;
			isUseLoaderCdn = false;
		}
		setImgSrc(false);
		setOldSrc(src);
	}

	// if (isUseLoader) {
	// 	rest.loader = myLoader;
	// }

	// if (isUseLoaderCache) {
	// 	rest.loader = myLoaderCacheInstant;
	// }

	// if (isUseLoaderCacheProxy) {
	// 	rest.loader = myLoaderCacheProxy;
	// }
	// if (isUseLoaderCdn) {
	// 	rest.loader = myLoaderCacheCDN;
	// }

	return (
		<Image
			{...rest}
			// src={imgSrc ? fallbackSrc : getLinkProxyCDN(src)}
			// src={fallbackSrc}
			src={src}
			onError={() => {
				setImgSrc(true);
			}}
			loading={loading}
			style={{
				maxWidth: "100%",
				height: "auto",
			}}
		/>
	);
};

const ImageFallbackBanner = ({ src, width, q = 100, ...rest }) =>
	ImageFallback({
		// src: getLinkCacheProxy({ url: src, w: width }),
		src,
		isUseLoaderCacheProxy: true,
		width,
		...rest,
		// fallbackSrc: DOMAIN_CDN_IMAGE ? getLinkFallbackCDN({ url: src }) : getLinkCacheFromGG({ src }),
		q,
	});

const ImageFallbackStatic = ({ src, q = 100, ...rest }) =>
	ImageFallback({
		src: getLinkImageStatic(src),
		fallbackSrc: getLinkImageStatic(src),
		isUseLoaderCacheProxy: true,
		...rest,
		q,
	});

const ImageFallbackStoreImage = ({
	src = STORE_IMAGE_DEFAULT,
	q = 100,
	...rest
}) =>
	ImageFallback({
		src: getLinkProxyFile(src) || STORE_IMAGE_DEFAULT,
		fallbackSrc: STORE_IMAGE_DEFAULT,
		isUseLoaderCacheProxy: true,
		q,
		...rest,
	});

const ImageFallbackProductImage = ({
	src = MISSING_IMAGE,
	q = 100,
	quality = 100,
	loading = "lazy",
	size = null,
	fallbackSrc = MISSING_IMAGE,
	...rest
}) =>
	ImageFallback({
		src:
			(src && size
				? `${src}${src?.includes("?") ? "&" : "?"}size=${size}`
				: src || MISSING_IMAGE) || MISSING_IMAGE,
		isUseLoaderCacheProxy: true,
		quality,
		q,
		loading,
		...rest,
		fallbackSrc: src
			? getLinkFallbackCacheImage({ url: src })
			: fallbackSrc || MISSING_IMAGE,
	});

export default ImageFallback;
export {
	ImageFallbackBanner,
	ImageFallbackProductImage,
	ImageFallbackStatic,
	ImageFallbackStoreImage,
};
