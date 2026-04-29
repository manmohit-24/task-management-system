import { useState } from "react";
import { Form } from "..";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";

export default function EditProfilePage() {
    const navigate = useNavigate();

    const [file, setFile] = useState();
    const [errorsMessage, setErrorsMessage] = useState("");

    const submitFile = (data) => setFile(data);

    const onSubmit = async (data) => {
        // backend logic here
    };

    return (
        <>
            <h1 className={styles.pageHeading}>Welcome To XYZ</h1>
            <Form
                inputsFormat={[
                    {
                        label: "Profile Picture",
                        type: "file",
                        submitFile: submitFile,
                    },
                    {
                        label: "Name",
                        type: "text",
                        validations: {
                            required: true,
                        },
                    },
                ]}
                onSubmit={onSubmit}
                buttonText="Continue"
            />

            <p className={styles.errorsContainer}>{errorsMessage}</p>
        </>
    );
}
