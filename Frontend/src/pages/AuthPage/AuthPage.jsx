import { useEffect, useState } from "react";
import "./AuthPage.css";
import { data, Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../../utils/Icons";
import {
    LoginForm,
    RegisterForm,
    ResetPasswordForm,
    VerifyEmailPage,
    EditProfileForm
} from "../../components";

const AuthPage = () => {
    const { authType } = useParams();

    let formComponent;

    if (authType === "login")formComponent = <LoginForm /> ;
    else if (authType === "register") formComponent = <RegisterForm /> ;
    else if (authType === "reset-password")
        formComponent = <ResetPasswordForm />;
    else if (authType === "verify-email") formComponent = <VerifyEmailPage />;
    else if (authType === "edit-profile") formComponent = <EditProfileForm />;
    else formComponent = <LoginForm />;

    return (
        <div className="AuthPageContainer">
            <Icon name={"IconLogo"} addionalclasses="AuthPageLogo" />
            <div className="AuthFormContainer">{formComponent}</div>
        </div>
    );
};

export default AuthPage;
