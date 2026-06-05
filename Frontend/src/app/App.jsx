import "./App.css";
import { useSession } from "@/features/auth/hooks/auth.hook";
import { useProjects } from "@/features/tasks/hooks/project.hooks";

import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import AppLoader from "./AppLoader/AppLoader";

const App = () => {
    const session = useSession();
    const projects = useProjects();

    const appPending = session.isPending || projects.isPending;

    if (appPending) return <AppLoader />;

    return (
        <>
            <Toaster
                toastOptions={{
                    style: {
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        border: "0.1rem solid var(--border-subtle)",
                        borderRadius: "1rem",
                    },
                }}
            />
            <Outlet />
        </>
    );
};

export default App;
