import { Button } from "../";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "@/utils/Icons";
import styles from "./AuthPage.module.css";

export default function CheckEmailPage() {
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email") || "Your Email";
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Check Your Inbox</h1>
                <p className={styles.subtext}>
                    If an account exists for <b>{email}</b>, we’ll send an email with instructions
                    to reset the password.
                </p>
            </div>

            <div className={styles.checkEmailImage} />

            <div className={styles.footerLinks}>
                <Button onClick={() => window.open("https://mail.google.com", "_blank")}>
                    <Icon name="IconGoogleLogo" size="M" />
                    Open Gmail
                </Button>

                <p className={styles.footerText}>
                    Didn’t receive anything? Check the spam folder or try again.
                </p>

                <Link className={styles.link} to="/login">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
