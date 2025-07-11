import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
	sidebarOpen: boolean;
}

interface MenuItem {
	id: string;
	label: string;
	icon: string;
	path: string;
	roles?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
	const location = useLocation();
	const { user } = useAuth();

	const menuItems: MenuItem[] = [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: "📊",
			path: "/dashboard",
		},
		{
			id: "categories",
			label: "Categories",
			icon: "🗂️",
			path: "/categories",
		},
		{
			id: "products",
			label: "Products",
			icon: "📦",
			path: "/products",
		},
    {
			id: "product-options",
			label: "Product Options",
			icon: "📦",
			path: "/product-options",
		},
		{
			id: "orders",
			label: "Orders",
			icon: "🛒",
			path: "/orders",
		},
		{
			id: "customers",
			label: "Customers",
			icon: "👥",
			path: "/customers",
		},
		{
			id: "inventory",
			label: "Inventory",
			icon: "📋",
			path: "/inventory",
			roles: ["admin", "editor"],
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: "📈",
			path: "/analytics",
			roles: ["admin"],
		},
		{
			id: "settings",
			label: "Settings",
			icon: "⚙️",
			path: "/settings",
			roles: ["admin"],
		},
	];

	const filteredMenuItems = menuItems.filter((item) => {
		if (!item.roles) return true;
		return item.roles.includes(user?.role || "");
	});

	return (
		<aside
			className={`bg-base-300 min-h-screen transition-all duration-300 ease-in-out fixed left-0 top-0 z-1 ${
				sidebarOpen ? "w-64 translate-x-0" : "w-16 -translate-x-0"
			}`}>
			<div className="p-4 h-full flex flex-col">
				{/* Logo/Brand */}
				<div
					className={`flex items-center mb-6 ${
						!sidebarOpen ? "justify-center" : "justify-start"
					}`}>
					<div
						className={`flex items-center ${
							sidebarOpen ? "gap-2" : "flex-nowrap"
						} `}>
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">
								N
							</span>
						</div>
						<span
							className={`font-bold text-lg transition-opacity duration-300  ${
								sidebarOpen
									? "delay-200"
									: "delay-300 opacity-0 absolute text-transparent"
							}`}>
							NoobStore
						</span>
					</div>
				</div>

				{/* Navigation Menu */}
				<nav className="space-y-2 flex-1">
					{filteredMenuItems.map((item) => {
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.id}
								to={item.path}
								className={`flex items-center p-2 rounded-lg transition-colors duration-200 gap-2 ${
									isActive
										? "bg-primary text-primary-content"
										: "hover:bg-base-200 text-base-content"
								}`}
								title={!sidebarOpen ? item.label : undefined}>
								<span className="text-lg">{item.icon}</span>
								<span
									className={`font-medium transition-all duration-200  ${
										sidebarOpen ? "delay-100" : "opacity-0"
									}`}>
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				{/* Bottom Section */}
				{sidebarOpen && (
					<div className="mt-auto">
						<div className="bg-base-200 rounded-lg p-3">
							<div className="flex items-center space-x-3">
								<div className="avatar">
									<div className="w-8 h-8 rounded-full">
										<img
											src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
											alt="User"
										/>
									</div>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">
										{user?.firstName} {user?.lastName}
									</p>
									<p className="text-xs opacity-70 truncate">
										{user?.role}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</aside>
	);
};

export default Sidebar;
