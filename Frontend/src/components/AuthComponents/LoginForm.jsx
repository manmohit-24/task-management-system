import { useState } from "react";
import { Form, Button } from "../";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../utils/Icons";
import { useDispatch , useSelector } from "react-redux";
import { setAuthData } from "../../store/Features/AuthSlice";
import authService from "../../services/AuthService";

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errorsMessage, setErrorsMessage] = useState("");
    const Email = useSelector((state) => state.AuthData.Email) || " ";

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
        let [message, isAuthenticated, resData] = await authService.login({
            email: data.Email,
            password: data.Password,
        });

        if (isAuthenticated) {
            dispatch(
                setAuthData({
                    Email: data.Email,
                    Name: resData.Name,
                }),
            );
            console.log("Login Message : ", message);

            navigate("/app/todos/inbox");
        } else {
            setErrorsMessage(message);
        }
    };

    return (
        <>
            <h1 className="AuthPageHeading">Welcome Back to XYX</h1>
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
                inputsFormat={[
                    {
                        label: "Email",
                        type: "email",
                    },
                    {
                        label: "Password",
                        type: "password",
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Log in"
                values={{ Email }}
            />
            <div className="AuthPageErrorsContainer">{errorsMessage}</div>
            <p>
                Forgot Password ?
                <Link to={"/auth/reset-password"} className="AuthPageLink">
                    Reset Password
                </Link>
            </p>
            <p>
                No Account ?
                <Link to={"/auth/register"} className="AuthPageLink">
                    Create Account
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
