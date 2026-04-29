import { Form, GoogleButton } from "../";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";
import { useLogin } from "../hooks/auth.hook";

export default function LoginPage() {
    const navigate = useNavigate();
    const {
        mutate: login,
        // isPending,
        isError,
        error,
        isSuccess,
    } = useLogin();

    const onSubmit = async (data) => {
        login(data);
        if (isSuccess) navigate("/");
    };

    return (
        <>
            <h1 className={styles.heading}>Welcome Back to XYX</h1>
            <p>or</p>
            <GoogleButton />
            <Form
                inputsFormat={[
                    {
                        label: "Email",
                        type: "email",
                    },
                    {
                        label: "Password",
                        type: "password",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Log in"
            />
            {isError && <div className={styles.errorsContainer}>{error.message}</div>}{" "}
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
