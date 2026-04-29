import { useState } from "react";
import { Form } from "../";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [errorsMessage, setErrorsMessage] = useState("");

    const onSubmit = async (data) => {
        // Backend Logic here
    };

    return (
        <>
            <h1 className={styles.heading}>Enter Your Email To Reset Password </h1>
            <Form
                inputsFormat={[
                    {
                        label: "Email",
                        type: "email",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Reset Password"
            />
            <p className={styles.errorsContainer}>{errorsMessage}</p>
            <p>
                <Link to={"/login"} className={styles.link}>
                    Cancel Password
                </Link>
            </p>
        </>
    );
}
