import { Button } from "../";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "@/utils/Icons";
import styles from "../styles/AuthPage.module.css";

export default function CheckEmailPage() {
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email") || "Your Email";
    return (
        <>
            <div className={styles.checkEmailImage} />
            <h1 className={styles.heading}>Check Your Inbox</h1>
            <p className="WrapText">
                if an account exists for <b> {email} </b>, you we recieve an email with instructions
                on resetting your password.
            </p>
            <br />
            <Button
                text={
                    <>
                        <Icon name={"IconGoogleLogo"} size={"M"} />
                        Open Gmail
                    </>
                }
                onClick={() => window.open("https://mail.google.com", "_blank")}
            />
            <Link className={styles.link} to={"login"}>
                Back to Login
            </Link>
        </>
    );
}
