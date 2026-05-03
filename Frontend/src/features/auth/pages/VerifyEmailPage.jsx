import { Button, OtpInput } from "../";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/utils/Icons";
import styles from "../styles/AuthPage.module.css";
import { useRef } from "react";
import { useState } from "react";

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const otp = useRef();
    const [error, setError] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(otp.current);
        if (!otp.current) {
            setError("Please enter the valid otp");
            return;
        }
        navigate("/");
    };
    return (
        <>
            <h1 className={styles.heading}>Enter OTP to activate account</h1>
            <p className="WrapText">
                Enter the otp we sent to <b> {email} </b> to finish account setup and email
                verification.
            </p>
            <br />
            <form
                onSubmit={onSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                }}
            >
                <OtpInput
                    onChange={(val) => {
                        otp.current = val;
                    }}
                />
                {error && <div className={styles.errorsContainer}>{error}</div>}{" "}
                <Button text="Continue" type="submit" />
            </form>
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
        </>
    );
}
