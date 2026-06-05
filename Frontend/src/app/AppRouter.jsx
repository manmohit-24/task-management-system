import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import {
    AuthLayout,
    LoginPage,
    RegisterPage,
    VerifyEmailPage,
    ResetPasswordPage,
    CheckEmailPage,
} from "@/features/auth/";
import { TasksLayout } from "@/features/tasks";
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
                element: <Navigate to="/app/inbox" replace />,
            },
            {
                path: "app",
                element: <Navigate to="/app/inbox" replace />,
            },
            {
                path: "app/:id?",
                element: <TasksLayout />,
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
