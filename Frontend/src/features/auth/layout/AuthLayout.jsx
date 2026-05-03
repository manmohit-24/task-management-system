import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/auth.hook";
import AuthLayoutPlain from "../components/AuthLayoutPlain/AuthLayoutPlain";
import AuthLayoutSplit from "../components/AuthLayoutSplit/AuthLayoutSplit";

export default function AuthLayout() {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    return <AuthLayoutPlain />;
}
