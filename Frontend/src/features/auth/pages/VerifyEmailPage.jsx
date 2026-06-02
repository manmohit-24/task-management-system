import { Button } from "../";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { useRef } from "react";
import { Form } from "../";
import { WorkInProgress } from "@/shared/components";
import { Google } from "@/shared/icons";

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const otp = useRef();

    const onSubmit = () => {
        console.log(otp.current);
        navigate("/");
    };
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Verify Email</h1>
                <p className={styles.subtext}>
                    Enter the verification code sent to <b>{email}</b> to activate the account and
                    complete email verification.
                </p>
            </div>

            <Form
                inputsFormat={[
                    {
                        name: "otp",
                        label: "OTP",
                        type: "otp",
                        length: 4,
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Verify Email"
            />

            <div className={styles.footerLinks}>
                <p className={styles.footerText}>
                    Didn’t receive the code? Check the inbox or spam folder.
                </p>

                <Button
                    variant="secondary"
                    onClick={() => window.open("https://mail.google.com", "_blank")}
                >
                    <Google size={20} />
                    Open Gmail
                </Button>
            </div>
            <WorkInProgress />
        </div>
    );
}
