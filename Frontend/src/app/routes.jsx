import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, Dashboard } from "../pages";
import {
    AuthLayout,
    LoginPage,
    RegisterPage,
    VerifyEmailPage,
    ResetPasswordPage,
    EditProfilePage,
} from "@/features/auth/";

import App from "./App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                    {
                        path: "verify-email",
                        element: <VerifyEmailPage />,
                    },
                    {
                        path: "reset-password",
                        element: <ResetPasswordPage />,
                    },
                    {
                        path: "edit-profile",
                        element: <EditProfilePage />,
                    },
                ],
            },
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "home",
                element: <HomePage />,
            },
            {
                path: "app/:pageType/:tagId",
                element: <Dashboard />,
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
