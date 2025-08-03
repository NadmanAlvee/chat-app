import { createBrowserRouter, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import SignUpPage from "../pages/SignUpPage";
import Navbar from "../components/Navbar";

export const createMainRouter = (authUser) => {
	return createBrowserRouter([
		{
			path: "/",
			element: authUser ? (
				<>
					<Navbar />
					<HomePage />
				</>
			) : (
				<Navigate to="/login" />
			),
		},
		{
			path: "/signup",
			element: !authUser ? (
				<>
					<Navbar />
					<SignUpPage />
				</>
			) : (
				<Navigate to="/" />
			),
		},
		{
			path: "/login",
			element: !authUser ? (
				<>
					<Navbar />
					<LoginPage />
				</>
			) : (
				<Navigate to="/" />
			),
		},
		{
			path: "/settings",
			element: (
				<>
					<Navbar />
					<SettingsPage />
				</>
			),
		},
		{
			path: "/profile",
			element: authUser ? (
				<>
					<Navbar />
					<ProfilePage />
				</>
			) : (
				<Navigate to="/login" />
			),
		},
	]);
};
