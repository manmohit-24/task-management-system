import { Button } from "../";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/utils/Icons";
import styles from "../styles/AuthPage.module.css";
import { useRef } from "react";
import { Form } from "../";

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
        <>
            <h1 className={styles.heading}>Enter OTP to activate account</h1>
            <p className="WrapText">
                Enter the otp we sent to <b> {email} </b> to finish account setup and email
                verification.
            </p>
            <br />
            <Form
                inputsFormat={[
                    {
                        label: "OTP",
                        type: "otp",
                        name: "otp",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Continue"
            />
            <Button
                variant="secondary"
                onClick={() => window.open("https://mail.google.com", "_blank")}
            >
                <Icon name={"IconGoogleLogo"} size={"M"} />
                Open Gmail
            </Button>
        </>
    );
}
