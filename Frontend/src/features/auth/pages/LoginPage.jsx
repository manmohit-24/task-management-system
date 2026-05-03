import { Form, GoogleButton } from "../";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";
import { useLogin } from "../hooks/auth.hook";

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
        <>
            <h1 className={styles.heading}>Welcome Back to XYX</h1>
            <Form
                inputsFormat={[
                    {
                        label: "Email",
                        type: "email",
                        name: "email",
                    },
                    {
                        label: "Password",
                        type: "password",
                        name: "password",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Log in"
            />
            {isError && <div className={styles.errorsContainer}>{error.message}</div>}{" "}
            <span>or</span>
            <GoogleButton />
            <p>
                Forgot Password ?
                <Link to={"/reset-password"} className={styles.link}>
                    {" "}
                    Reset Password
                </Link>
            </p>
            <p>
                No Account ?
                <Link to={"/register"} className={styles.link}>
                    {" "}
                    Create Account
                </Link>
            </p>
        </>
    );
}
