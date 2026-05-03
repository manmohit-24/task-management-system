import { useEffect, useState } from "react";
import { Button } from "../";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../utils/Icons";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../../store/Features/AuthSlice";

const VerifyEmailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Email = useSelector((state) => state.AuthData.Email);
    const Name = useSelector((state) => state.AuthData.Name);

    const isRegistration = Email && Name;
 
    return (
        <>
            <div className="AuthPageCheckEmailImage" />
            <h1 className="AuthPageHeading noDecor">Check Your Inbox</h1>

            {isRegistration ? (
                <>
                    <p className="WrapText">
                        Click on the link we sent to <b> {Email} </b> to finish
                        account setup and email verification.
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
                    <Button
                        text={"Verify Later"}
                        onClick={() => navigate("/auth/edit-profile")}
                    />
                </>
            ) : (
                <>
                    <p className="WrapText">
                        if an account exists for <b> {Email} </b>, you we
                        recieve an email with instructions on resetting your
                        password.
                    </p>
                    <br />
                    <a href="https://mail.google.com" target="_blank">
                        <Button text="Open Gmail" />
                    </a>
                    <Link className="AuthPageLink" to={"/auth/login"}>
                        {" "}
                        Back to Login{" "}
                    </Link>
                </>
            )}
        </>
    );
};

export default VerifyEmailPage;
