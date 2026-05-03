import { useState } from "react";
import { Form } from "../";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Features/AuthSlice";
import authService from "../../services/AuthService";

const ResetPasswordForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [errorsMessage, setErrorsMessage] = useState("");

    const onSubmit = async (data) => {
        const [message, isLinkSent] = await authService.resetPassword(
            data.Email,
        );

        if (isLinkSent) {
            console.log("Reset Password Message : ", message);
            dispatch(setAuthData({ Email: data.Email }));
            navigate("/auth/verify-email");
        } else {
            setErrorsMessage(message);
        }
    };

    return (
        <>
            <h1 className="AuthPageHeading">
                Enter Your Email To Reset Password{" "}
            </h1>
            <Form
                inputsFormat={[
                    {
                        label: "Email",
                        type: "email",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Reset Password"
            />
            <p className="AuthPageErrorsContainer">{errorsMessage}</p>
            <p>
                <Link to={"/auth/login"} className="AuthPageLink">
                    Cancel Password
                </Link>
            </p>
        </>
    );
};

export default ResetPasswordForm;
