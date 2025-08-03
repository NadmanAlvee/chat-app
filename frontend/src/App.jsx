import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { createMainRouter } from "./routes/routes";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

export const App = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
	const { theme } = useThemeStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const router = createMainRouter(authUser);

	if (isCheckingAuth && !authUser) {
		return (
			<div className="flex items-center justify-center h-screen">
				<LoaderCircle className="size-10 animate-spin" />
			</div>
		);
	}

	return (
		<div data-theme={theme}>
			<RouterProvider router={router} />
			<Toaster />
		</div>
	);
};

export default App;
