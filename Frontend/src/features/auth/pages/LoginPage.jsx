import { Form, GoogleButton } from "../";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { useLogin } from "../hooks/auth.hook";
import config from "@/app/config";

export default function LoginPage() {
    const navigate = useNavigate();
    const {
        mutate: login,
        isError,
        error,
    } = useLogin({
        onSuccess: () => navigate("/"),
    });

    const onSubmit = async (data) => login(data);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Welcome Back</h1>
                <p className={styles.subtext}>
                    Log in to continue to {config.appName} with the account credentials used during
                    signup.
                </p>
            </div>

            <Form
                inputsFormat={[
                    {
                        name: "email",
                        label: "Email",
                        type: "email",
                    },
                    {
                        name: "password",
                        label: "Password",
                        type: "password",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Log In"
            />

            {isError && <div className={styles.errorsContainer}>{error.message}</div>}

            <div className={styles.divider}>
                <span>or</span>
            </div>

            <GoogleButton />

            <div className={styles.footerLinks}>
                <p className={styles.footerText}>
                    Forgot the password?{" "}
                    <Link to="/forgot-password" className={styles.link}>
                        Reset it
                    </Link>
                </p>

                <p className={styles.footerText}>
                    Don’t have an account?{" "}
                    <Link to="/register" className={styles.link}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
