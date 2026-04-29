import { useState } from "react";
import { Form, GoogleButton } from "..";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [errorsMessage, setErrorsMessage] = useState("");

    const [inputsFormat, setinputsFormat] = useState([
        {
            label: "Email",
        },
    ]);
    const [buttonText, setButtonText] = useState("Continue with Email");
    const [showLink, setShowLink] = useState(false);

    const onSubmit = async (data) => {
        if (inputsFormat.length === 1) {
            const isEmailAvalable = true;
            console.log(data);
            if (isEmailAvalable) {
                setinputsFormat([
                    {
                        label: "Email",
                        type: "email",
                    },
                    {
                        label: "Password",
                        type: "password",
                    },
                ]);
                setButtonText("Create Account");
                setShowLink(true);
            } else {
                navigate("/login");
            }
        } else {
            const isRegistered = true;
            // const dummyName = data.Email.split("@")[0];
            if (isRegistered) {
                navigate("/verify-email");
            } else {
                setErrorsMessage("error");
            }
        }
    };

    return (
        <>
            <h1 className={styles.heading}>Create Account</h1>
            <p>or</p>
            <GoogleButton />
            <Form inputsFormat={inputsFormat} onSubmit={onSubmit} buttonText={buttonText} />
            <p className={styles.errorsContainer}>{errorsMessage}</p>
            <p style={showLink ? { display: "block" } : { display: "none" }}>
                Already Have an account ?
                <Link to={"/login"} className={styles.link}>
                    Log in
                </Link>
            </p>
        </>
    );
}
