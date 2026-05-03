import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthPage , HomePage , Dashboard} from "./pages/index.js";
import "./Themes/Light.css";
// import "./Themes/Dark.css";
import "./Themes/Mutual.css";
import "./utils/Icons.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/home",
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

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
