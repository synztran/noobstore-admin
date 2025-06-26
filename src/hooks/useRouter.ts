import {
	useNavigate,
	useLocation,
	useParams,
	useSearchParams,
} from "react-router-dom";

export const useRouter = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	return {
		// Navigation methods
		push: (href: string) => navigate(href),
		replace: (href: string) => navigate(href, { replace: true }),
		back: () => navigate(-1),
		forward: () => navigate(1),

		// Route information
		pathname: location.pathname,
		query: Object.fromEntries(searchParams.entries()),
		asPath: location.pathname + location.search,

		// Route parameters
		params,

		// Query parameter methods
		setQuery: (query: Record<string, string>) => {
			setSearchParams(query);
		},

		// Check if route is active
		isReady: true, // React Router is always ready

		// Events (simplified)
		events: {
			on: (event: string, callback: () => void) => {
				// Store callback for later use
				if (!(window as any).routerEvents) {
					(window as any).routerEvents = {};
				}
				if (!(window as any).routerEvents[event]) {
					(window as any).routerEvents[event] = [];
				}
				(window as any).routerEvents[event].push(callback);
			},
			off: (event: string, callback: () => void) => {
				// Remove callback from stored events
				if (
					(window as any).routerEvents &&
					(window as any).routerEvents[event]
				) {
					const index = (window as any).routerEvents[event].indexOf(
						callback
					);
					if (index > -1) {
						(window as any).routerEvents[event].splice(index, 1);
					}
				}
			},
			emit: (event: string) => {
				// Emit event to all registered callbacks
				if (
					(window as any).routerEvents &&
					(window as any).routerEvents[event]
				) {
					(window as any).routerEvents[event].forEach(
						(callback: () => void) => {
							callback();
						}
					);
				}
			},
		},
	};
};
