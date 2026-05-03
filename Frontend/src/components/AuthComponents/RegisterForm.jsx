import { useState } from "react";
import { Form, Button } from "../";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../utils/Icons";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Features/AuthSlice";
import authService from "../../services/AuthService";

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorsMessage, setErrorsMessage] = useState("");

    const [inputsFormat, setinputsFormat] = useState([
        {
            label: "Email",
        },
    ]);
    const [buttonText, setButtonText] = useState("Continue with Email");
    const [showLink, setShowLink] = useState(false);

    const GoogleLogin = async () => {
        const [message, isAuthenticated, data] =
            await authService.googleLogin();
        if (isAuthenticated) {
            dispatch(setAuthData({ Email: data.email, Name: data.name }));
            navigate("/app/todos/inbox");
        } else {
            setErrorsMessage(message);
        }
    };

    const onSubmit = async (data) => {
        if (inputsFormat.length === 1) {
            const [message, isEmailAvalable] =
                await authService.checkEmailAvailability(data.Email);

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

                console.log("Register Message :", message);
            } else {
                dispatch(setAuthData({ Email: data.Email }));
                console.log("Register Message :", message);
                navigate("/auth/login");
            }
        } else {
            const [message, isRegistered] = await authService.register({
                email: data.Email,
                password: data.Password,
            });

            const dummyName = data.Email.split("@")[0];
            if (isRegistered) {
                dispatch(setAuthData({ Email: data.Email, Name: dummyName }));
                console.log("Register Message :", message);
                navigate("/auth/verify-email");
            } else {
                setErrorsMessage(message);
            }
        }
    };

    return (
        <>
            <h1 className="AuthPageHeading">Create Account</h1>
            <Button
                text={
                    <Icon
                        name={"IconGoogleButton"}
                        size={"M"}
                        addionalclasses="GoogleButton"
                    />
                }
                style={{ "--bg": "white" }}
                onClick={GoogleLogin}
            />
            <p>or</p>
            <Form
                inputsFormat={inputsFormat}
                onSubmit={onSubmit}
                buttonText={buttonText}
            />
            <p className="AuthPageErrorsContainer">{errorsMessage}</p>
            <p style={showLink ? { display: "block" } : { display: "none" }}>
                Already Have an account ?
                <Link to={"/auth/login"} className="AuthPageLink">
                    Log in
                </Link>
            </p>
        </>
    );
};

export default RegisterForm;
