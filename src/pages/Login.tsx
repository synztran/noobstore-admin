import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/hooks/useRouter";
import { PAGE_LINK } from "@/constants";
import { toast } from "react-hot-toast";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [onProcessing, setProcessing] = useState<boolean>(false);
	const { login, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push(PAGE_LINK.DASHBOARD);
		}
	}, [isAuthenticated, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setProcessing(true);

		try {
			const success = await login({
				email,
				password,
				success: () => {
					router.push(PAGE_LINK.DASHBOARD);
				},
				cb: () => {
					setProcessing(false);
				},
			});
			if (success) {
				toast.success("Login successful");
				setTimeout(() => {
					router.push(PAGE_LINK.DASHBOARD);
				}, 200);
			} else {
				toast.error("Invalid email or password");
				setError("Invalid email or password");
			}
		} catch (err) {
			toast.error("An error occurred during login");
			setError("An error occurred during login");
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			router.push(PAGE_LINK.DASHBOARD);
		}
	}, [isAuthenticated]);

	return (
		<div className="w-[400px] min-h-screen flex items-center justify-center p-4 mx-auto">
			<div className="w-full space-y-8">
				<div className="bg-base-100 rounded-lg shadow-xl p-8">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
							<span className="text-2xl text-primary-content font-bold">
								N
							</span>
						</div>
						<h2 className="text-3xl font-bold text-base-content">
							CMS
						</h2>
						<p className="mt-2 text-sm text-base-content/70">
							Sign in to your account
						</p>
					</div>

					{/* Login Form */}
					<form className="space-y-6" onSubmit={handleSubmit}>
						{error && (
							<div className="alert alert-error">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{error}</span>
							</div>
						)}

						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="email"
								className="input input-bordered"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Password</span>
							</label>
							<div className="relative">
								<input
									type={isVisible ? "text" : "password"}
									className="input input-bordered pr-12"
									placeholder="Enter your password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
								<button
									type="button"
									className="absolute z-10 cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
									onClick={() => setIsVisible(!isVisible)}>
									{isVisible ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953.138 2.863.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>

						<div className="form-control">
							<button
								type="submit"
								disabled={onProcessing}
								className="btn btn-primary w-full">
								{onProcessing ? (
									<div className="loading loading-spinner loading-md" />
								) : (
									"Sign In"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
