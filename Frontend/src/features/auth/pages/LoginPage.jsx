import { useState } from "react";
import { Form, GoogleButton } from "../";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";

export default function LoginPage() {
    const navigate = useNavigate();

    const [errorsMessage, setErrorsMessage] = useState("");
    const Email = ""; // TODO: email

    const onSubmit = async (data) => {
        // backend Logic here
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
                values={{ Email }}
            />
            <div className={styles.errorsContainer}>{errorsMessage}</div>
            <p>
                Forgot Password ?
                <Link to={"/reset-password"} className={styles.link}>
                    Reset Password
                </Link>
            </p>
            <p>
                No Account ?
                <Link to={"/register"} className={styles.link}>
                    Create Account
                </Link>
            </p>
        </>
    );
}
