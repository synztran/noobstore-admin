import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "@/hooks/useRouter";
import AuthClient from "@/client/AuthClient";
import { HTTP_STATUS } from "@/constants";
import { getFirst } from "@/client";
import UserClient from "@/client/UserClient";
import { ACCESS_TOKEN, GENERAL_DOMAIN } from "@/systemConfig";
import toast from "react-hot-toast";
import type { IAuthUser, IAuthUserInfo } from "@/interfaces";

interface ILogin {
	email: string;
	password: string;
	success: () => void;
	cb: () => void;
}

interface AuthContextType {
	user: IAuthUser | null;
	isAuthenticated: boolean;
	login: ({ email, password, success, cb }: ILogin) => Promise<boolean>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<IAuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	const setCookies = useCallback((info: any) => {
		const { bearerToken = null } = info;
		Cookies.set(ACCESS_TOKEN, bearerToken, {
			domain: GENERAL_DOMAIN,
			sameSite: "Lax",
		});
	}, []);

	useEffect(() => {
		const token = Cookies.get(ACCESS_TOKEN);
		console.log("token", token);

		if (token) {
			try {
				loadUserFromCookies();
			} catch (error) {
				console.error("Error parsing user data:", error);
				// Clear invalid cookies
				Cookies.remove("auth_token");
				Cookies.remove("user_data");
			}
		}
		setLoading(false);
	}, []);

	const loadUserFromCookies = useCallback(
		async (callback?: (data: any) => void) => {
			const respUser = await UserClient.getCurrentUser();
			console.log(respUser);
			if (respUser?.status === "OK") {
				const userInfo: IAuthUser | null = getFirst(
					respUser,
					null
				) as IAuthUser | null;
				const cookiesValue = Cookies.get(ACCESS_TOKEN);
				if (cookiesValue && cookiesValue.length > 0) {
					setCookies({ bearerToken: cookiesValue });
				}

				setUser(userInfo);
				setLoading(false);
				if (callback && typeof callback === "function")
					callback(userInfo);
			}
		},
		[setUser, setLoading]
	);

	const login = async ({
		email,
		password,
		success,
		cb,
	}: ILogin): Promise<boolean> => {
		try {
			const resp = await AuthClient.postLogin({ email, password });
			console.log(resp);

			if (resp.status === HTTP_STATUS.Error) {
				toast.error(resp.message);
				return false;
			}

			const tokenInfo: IAuthUserInfo | null = getFirst(
				resp,
				null
			) as IAuthUserInfo | null;
			console.log("tokenInfo", tokenInfo);
			if (tokenInfo) {
				setCookies({ bearerToken: tokenInfo.bearerToken });
				loadUserFromCookies();
			}

			if (success) {
				success();
			}
			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const logout = () => {
		Cookies.remove(ACCESS_TOKEN);
		setUser(null);
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		login,
		logout,
		loading,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const LoadingRoute = ({ children }: { children: any }) => {
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const handleStart = () => setLoading(true);
		const handleComplete = () => setLoading(false);

		router.events.on("routeChangeStart", () => handleStart());
		router.events.on("routeChangeComplete", () => handleComplete());
		router.events.on("routeChangeError", () => handleComplete());

		return () => {
			router.events.off("routeChangeStart", () => handleStart());
			router.events.off("routeChangeComplete", () => handleComplete());
			router.events.off("routeChangeError", () => handleComplete());
		};
	});

	if (isLoading) {
		return (
			<div className="flex w-full h-screen top-1/2 left-1/2 relative items-center">
				<div className="loading loading-spinner loading-lg" />
			</div>
		);
	}

	return children;
};
