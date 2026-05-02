import { Form, GoogleButton } from "..";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";
import { useRegister } from "../hooks/auth.hook";
import { useRef } from "react";

export default function RegisterPage() {
    const navigate = useNavigate();
    const email = useRef("Your Email");

    const {
        mutate: register,
        isError,
        error,
    } = useRegister({
        onSuccess: () => {
            navigate({
                pathname: "/verify-email",
                search: createSearchParams({
                    email: email.current,
                }).toString(),
            });
        },
    });

    const onSubmit = (data) => {
        email.current = data.email;
        register(data);
    };

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.heading}>Create Your Account</h1>
                <p className={styles.subtext}>
                    Sign up to get started. Create an account with email or continue with Google.
                </p>
            </div>

            <Form
                inputsFormat={[
                    {
                        name: "name",
                        label: "Name",
                        type: "text",
                    },
                    {
                        name: "username",
                        label: "Username",
                        type: "text",
                    },
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
                buttonText="Create Account"
                className={styles.registerFormContainer}
            />

            {isError && <div className={styles.errorsContainer}>{error.message}</div>}

            <div className={styles.divider}>
                <span>or</span>
            </div>

            <GoogleButton />

            <p className={styles.footerText}>
                Already have an account?{" "}
                <Link to="/login" className={styles.link}>
                    Log in
                </Link>
            </p>
        </>
    );
}
