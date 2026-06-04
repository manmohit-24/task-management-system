import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/auth.hook";
import { AuthCenteredShell, AuthSplitShell } from "../";

export default function AuthLayout() {
    const isAuthenticated = useIsAuthenticated();
    if (isAuthenticated) return <Navigate to="/app/inbox" replace />;

    return (
        <AuthCenteredShell>
            <Outlet />
        </AuthCenteredShell>
    );
}
