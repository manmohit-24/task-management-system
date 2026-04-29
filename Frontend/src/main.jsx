import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./app/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./Themes/Light.css";
// import "./Themes/Dark.css";
import "./Themes/Mutual.css";
import "./utils/Icons.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppRouter />
        </QueryClientProvider>
    </StrictMode>,
);
