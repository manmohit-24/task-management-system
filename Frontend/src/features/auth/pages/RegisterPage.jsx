import { Form, GoogleButton } from "..";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";
import { useRegister } from "../hooks/auth.hook";

export default function RegisterPage() {
    const navigate = useNavigate();
    const {
        mutate: register,
        isError,
        error,
    } = useRegister({
        onSuccess: () => navigate("/"),
    });

    const onSubmit = (data) => register(data);

    return (
        <>
            <h1 className={styles.heading}>Create Account</h1>
            <p>or</p>
            <GoogleButton />
            <Form
                inputsFormat={[
                    {
                        label: "Name",
                        type: "text",
                    },
                    {
                        label: "Username",
                        type: "text",
                    },
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
                buttonText="Continue with Email"
            />{" "}
            {isError && <div className={styles.errorsContainer}>{error.message}</div>}{" "}
            <p>
                Already Have an account ?
                <Link to={"/login"} className={styles.link}>
                    {" "}
                    Log in
                </Link>
            </p>
        </>
    );
}
