import { Form } from "..";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import styles from "./AuthPage.module.css";
import WorkInProgress from "@/components/WorkInProgress/WorkInProgress";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Backend Logic here
        navigate({
            pathname: "/check-email",
            search: createSearchParams({
                email: data.email,
            }).toString(),
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Forgot Password?</h1>
                <p className={styles.subtext}>
                    Enter the email associated with the account and we’ll send a password reset link
                    and verification code.
                </p>
            </div>

            <Form
                inputsFormat={[
                    {
                        name: "email",
                        label: "Email Address",
                        type: "email",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Send Reset Instructions"
            />

            <p className={styles.footerText}>
                Remembered the password?{" "}
                <Link to="/login" className={styles.link}>
                    Back to Login
                </Link>
            </p>
            <WorkInProgress />
        </div>
    );
}
