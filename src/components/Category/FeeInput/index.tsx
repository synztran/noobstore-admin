interface IProps {
	formik: any;
}

const FeesInput = ({ formik }: IProps) => {
	return (
		<div className="flex gap-4 mt-4">
			<div className="relative w-full">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Phí xử lý đơn hàng</span>
					</label>
					<input
						type="number"
						id="handle"
						name="handle"
						className={`input input-bordered w-full ${
							formik.touched.handle &&
							Boolean(formik.errors.handle)
								? "input-error"
								: ""
						}`}
						value={formik.values.handle}
						onChange={formik.handleChange}
					/>
					{formik.touched.handle && formik.errors.handle && (
						<label className="label">
							<span className="label-text-alt text-error">
								{formik.errors.handle}
							</span>
						</label>
					)}
				</div>
				<span className="absolute -bottom-6 left-1 text-green-600">
					{formik.values.handle}%
				</span>
			</div>
			<div className="relative w-full">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Thuế</span>
					</label>
					<input
						type="number"
						id="tax"
						name="tax"
						className={`input input-bordered w-full ${
							formik.touched.tax && Boolean(formik.errors.tax)
								? "input-error"
								: ""
						}`}
						value={formik.values.tax}
						onChange={formik.handleChange}
					/>
					{formik.touched.tax && formik.errors.tax && (
						<label className="label">
							<span className="label-text-alt text-error">
								{formik.errors.tax}
							</span>
						</label>
					)}
				</div>
				<span className="absolute -bottom-6 left-1 text-green-600">
					{formik.values.tax}%
				</span>
			</div>
		</div>
	);
};

export default FeesInput;
