import React from "react";
import { useRouter } from "../hooks/useRouter";
import {
	useNavigate,
	useLocation,
	useParams,
	useSearchParams,
} from "react-router-dom";

// Example component showing different routing patterns
const RouterExamples: React.FC = () => {
	// Using our custom useRouter hook (Next.js-like API)
	const router = useRouter();

	// Using React Router hooks directly
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	// Example: Programmatic navigation
	const handleNavigate = () => {
		// Using custom useRouter (Next.js-like)
		router.push("/dashboard");

		// Or using React Router directly
		// navigate('/dashboard');
	};

	// Example: Navigation with query parameters
	const handleNavigateWithQuery = () => {
		// Using custom useRouter
		router.push("/products?category=electronics&sort=price");

		// Or using React Router directly
		// navigate('/products?category=electronics&sort=price');
	};

	// Example: Replace current route (no back button)
	const handleReplace = () => {
		router.replace("/dashboard");
	};

	// Example: Go back
	const handleGoBack = () => {
		router.back();
	};

	// Example: Update query parameters
	const handleUpdateQuery = () => {
		router.setQuery({ page: "2", filter: "active" });
	};

	return (
		<div className="p-6 space-y-4">
			<h2 className="text-2xl font-bold">Router Examples</h2>

			{/* Current route information */}
			<div className="bg-gray-100 p-4 rounded">
				<h3 className="font-semibold mb-2">Current Route Info:</h3>
				<p>
					<strong>Pathname:</strong> {router.pathname}
				</p>
				<p>
					<strong>Full Path:</strong> {router.asPath}
				</p>
				<p>
					<strong>Query:</strong> {JSON.stringify(router.query)}
				</p>
				<p>
					<strong>Params:</strong> {JSON.stringify(router.params)}
				</p>
			</div>

			{/* Navigation buttons */}
			<div className="space-y-2">
				<button onClick={handleNavigate} className="btn btn-primary">
					Navigate to Dashboard
				</button>

				<button
					onClick={handleNavigateWithQuery}
					className="btn btn-secondary">
					Navigate with Query Params
				</button>

				<button onClick={handleReplace} className="btn btn-accent">
					Replace Current Route
				</button>

				<button onClick={handleGoBack} className="btn btn-outline">
					Go Back
				</button>

				<button onClick={handleUpdateQuery} className="btn btn-info">
					Update Query Params
				</button>
			</div>

			{/* Direct React Router usage examples */}
			<div className="bg-blue-50 p-4 rounded">
				<h3 className="font-semibold mb-2">
					Direct React Router Usage:
				</h3>
				<div className="space-y-2 text-sm">
					<p>
						<code>useNavigate()</code> - For programmatic navigation
					</p>
					<p>
						<code>useLocation()</code> - For current route
						information
					</p>
					<p>
						<code>useParams()</code> - For route parameters
					</p>
					<p>
						<code>useSearchParams()</code> - For query parameters
					</p>
				</div>
			</div>
		</div>
	);
};

export default RouterExamples;
