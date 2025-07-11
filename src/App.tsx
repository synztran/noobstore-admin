import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider, LoadingRoute } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import { Toaster } from "react-hot-toast";
import Categories from "./pages/Categories";
import ProductOptionsPage from "./pages/ProductOptions";

function App() {
	return (
		<div data-theme="light">
			<Router>
				<AuthProvider>
					<LoadingRoute>
						<Routes>
							{/* Public routes */}
							<Route path="/login" element={<Login />} />

							{/* Protected routes */}
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<Layout>
											<Dashboard />
										</Layout>
									</ProtectedRoute>
								}
							/>

							<Route
								path="/products"
								element={
									<ProtectedRoute>
										<Layout>
											<Products />
										</Layout>
									</ProtectedRoute>
								}
							/>

							<Route
								path="/categories"
								element={
									<ProtectedRoute>
										<Layout>
											<Categories />
										</Layout>
									</ProtectedRoute>
								}
							/>

							<Route
								path="/product-options"
								element={
									<ProtectedRoute>
										<Layout>
											<ProductOptionsPage />
										</Layout>
									</ProtectedRoute>
								}
							/>

							{/* Redirect root to dashboard */}
							<Route
								path="/"
								element={<Navigate to="/dashboard" replace />}
							/>

							{/* Catch all route */}
							<Route
								path="*"
								element={<Navigate to="/dashboard" replace />}
							/>
						</Routes>
						<Toaster />
					</LoadingRoute>
				</AuthProvider>
			</Router>
		</div>
	);
}

export default App;
