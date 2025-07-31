import React from "react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// You can log error info here if needed
		// console.error("ErrorBoundary caught an error", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="p-4 text-red-600 bg-red-100 rounded">
						<h2>Something went wrong.</h2>
						<pre>{this.state.error?.message}</pre>
					</div>
				)
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
