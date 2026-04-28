import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthPage, HomePage, Dashboard } from "../pages";
import App from "./App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "home",
                element: <HomePage />,
            },
            {
                path: "auth/:authType",
                element: <AuthPage />,
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
