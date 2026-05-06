import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/auth.hook";
import { AuthCenteredShell, AuthSplitShell } from "../";

export default function AuthLayout() {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    return (
        <AuthCenteredShell>
            <Outlet />
        </AuthCenteredShell>
    );
}
