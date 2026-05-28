import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import AppRouter from "@/app/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/shared/themes/";
import { ConfirmDeleteProvider } from "./app/providers/ConfirmDeleteProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <ConfirmDeleteProvider>
                    <AppRouter />
                </ConfirmDeleteProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
);
