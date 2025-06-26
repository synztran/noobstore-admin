import React from "react";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
	const { user, logout } = useAuth();

	const handleLogout = () => {
		logout();
	};

	return (
		<header
			className={`bg-base-200 shadow-lg border-b border-base-300 fixed top-0 right-0 left-0 z-[3] transition-all duration-300 ${
				sidebarOpen ? "ml-64" : "ml-16"
			}`}>
			<div className="navbar">
				{/* Left side */}
				<div className="navbar-start">
					<button
						className="btn btn-ghost btn-circle"
						onClick={() => setSidebarOpen(!sidebarOpen)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<div className="ml-4">
						<h1 className="text-xl font-bold">CMS</h1>
					</div>
				</div>

				{/* Center - Search */}
				<div className="navbar-center hidden lg:flex">
					<div className="form-control">
						<div className="input-group">
							<input
								type="text"
								placeholder="Search..."
								className="input input-bordered w-96"
							/>
							<button className="btn btn-square">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Right side */}
				<div className="navbar-end">
					{/* Mobile search */}
					<div className="lg:hidden">
						<button className="btn btn-ghost btn-circle">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
					</div>

					{/* Notifications */}
					<div className="dropdown dropdown-end">
						<button className="btn btn-ghost btn-circle">
							<div className="indicator">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
									/>
								</svg>
								<span className="badge badge-xs badge-primary indicator-item">
									3
								</span>
							</div>
						</button>
						<ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
							<li>
								<a>New order received</a>
							</li>
							<li>
								<a>Product out of stock</a>
							</li>
							<li>
								<a>System update available</a>
							</li>
						</ul>
					</div>

					{/* User profile */}
					<div className="dropdown dropdown-end ml-2">
						<button className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<img
									src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
									alt="Profile"
								/>
							</div>
						</button>
						<ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
							<li className="menu-title">
								<span>
									{user?.firstName} {user?.lastName}
								</span>
							</li>
							<li className="menu-title">
								<span className="text-xs opacity-70">
									{user?.email}
								</span>
							</li>
							<div className="divider my-1"></div>
							<li>
								<a>Profile</a>
							</li>
							<li>
								<a>Settings</a>
							</li>
							<div className="divider my-1"></div>
							<li>
								<a onClick={handleLogout}>Logout</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
