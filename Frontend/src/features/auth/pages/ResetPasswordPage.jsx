import { Form } from "../";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";

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
        <>
            <h1 className={styles.heading}>Request Reset Password</h1>
            <Form
                inputsFormat={[
                    {
                        label: "Email",
                        type: "email",
                        name: "email",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Reset Password"
            />
            <p>
                <Link to={"/login"} className={styles.link}>
                    Back to Login
                </Link>
            </p>
        </>
    );
}
