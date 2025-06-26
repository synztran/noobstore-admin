import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className="min-h-screen w-screen">
			<main
				className={`transition-all duration-300 z-[2] ${
					sidebarOpen ? "ml-64 mt-16" : "ml-16 mt-16"
				}`}>
				<Header
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>
				<Sidebar sidebarOpen={sidebarOpen} />
				<div className="p-6">{children}</div>
			</main>
		</div>
	);
};

export default Layout;
