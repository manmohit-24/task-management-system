import { useState } from "react";
import { Form } from "../";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Features/AuthSlice";
import { useNavigate } from "react-router-dom";
import bucketService from "../../services/BucketService";

const EditProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [file, setFile] = useState();
    const [errorsMessage, setErrorsMessage] = useState("");

    const submitFile = (data) => setFile(data);

    const onSubmit = async (data) => {
        const [message, isUploaded, fileUrl] = await bucketService.uploadFile(file);

        if (isUploaded) {
            data["file"] = fileUrl;
            dispatch(setAuthData({ Name: data.Name, ProfilePic: data.file }));
            console.log(data);
            navigate("/app/todos/inbox");
        } else {
            setErrorsMessage(message);
        }
    };

    return (
        <>
            <h1 className="AuthPageHeading">Welcome To XYZ</h1>
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
            <p className="AuthPageErrorsContainer">{errorsMessage}</p>
        </>
    );
};

export default EditProfileForm;
