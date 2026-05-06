import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages";
import {
    AuthLayout,
    LoginPage,
    RegisterPage,
    VerifyEmailPage,
    ResetPasswordPage,
    CheckEmailPage,
} from "@/features/auth/";

import { TasksLayout } from "../features/tasks";

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
                        path: "forgot-password",
                        element: <ResetPasswordPage />,
                    },
                    {
                        path: "check-email",
                        element: <CheckEmailPage />,
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
                path: "app/",
                element: <TasksLayout />,
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
