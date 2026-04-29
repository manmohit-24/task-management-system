import { Button } from "../";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/utils/Icons";
import styles from "../styles/AuthPage.module.css";

export default function VerifyEmailPage() {
    const navigate = useNavigate();

    const Email = "";
    const Name = "";

    const isRegistration = Email && Name;

    return (
        <>
            <div className={styles.checkEmailImage} />
            <h1 className={styles.heading}>Check Your Inbox</h1>

            {isRegistration ? (
                <>
                    <p className="WrapText">
                        Click on the link we sent to <b> {Email} </b> to finish account setup and
                        email verification.
                    </p>
                    <br />
                    {/* <a href="https://mail.google.com" target="_blank"> */}
                    <Button
                        text={
                            <>
                                <Icon name={"IconGoogleLogo"} size={"M"} />
                                Open Gmail
                            </>
                        }
                        style={{
                            "--bg": "var(--Primary-Bg)",
                            color: "var(--Primary-Text)",
                        }}
                        onClick={() => window.open("https://mail.google.com", "_blank")}
                    />
                    {/* </a> */}
                    <Button text={"Verify Later"} onClick={() => navigate("edit-profile")} />
                </>
            ) : (
                <>
                    <p className="WrapText">
                        if an account exists for <b> {Email} </b>, you we recieve an email with
                        instructions on resetting your password.
                    </p>
                    <br />
                    <a href="https://mail.google.com" target="_blank">
                        <Button text="Open Gmail" />
                    </a>
                    <Link className={styles.link} to={"login"}>
                        {" "}
                        Back to Login{" "}
                    </Link>
                </>
            )}
        </>
    );
}
