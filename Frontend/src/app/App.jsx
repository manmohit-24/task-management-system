import "./App.css";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const App = () => {
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
