import { Input, Button, FileUpload } from "..";
import "./Form.css";
import { useForm } from "react-hook-form";

const Form = ({
    inputsFormat = [
        { label: "label", type: "text", validations: {}, submitFile: () => {} },
    ],
    values = {},
    buttonText,
    buttonStyle = {},
    onSubmit = () => {},
}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: values });

    let inputs = Array(inputsFormat.length);

    const commonValidations = {
        Email: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
            },
        },
        Password: {
            required: "Password is required",
            minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
            },
        },
    };

    for (let i = 0; i < inputsFormat.length; i++) {
        let obj = inputsFormat[i];

        let validations = {
            ...commonValidations[obj.label],
            ...obj.validations,
        } || { required: false };

        delete obj.validations;

        if (obj.type == "file") {
            inputs[i] = <FileUpload key={i} {...obj}></FileUpload>;
        } else {
            inputs[i] = (
                <div className="FormInput" key={i}>
                    <Input
                        key={i}
                        {...obj}
                        {...register(`${obj.label}`, { ...validations })}
                        watch={watch}
                    ></Input>

                    <div className="FormError">
                        {errors[obj.label] && errors[obj.label].message}
                    </div>
                </div>
            );
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="FormContainer">
            {inputs}
            <Button
                text={buttonText}
                type="submit"
                style={buttonStyle}
            ></Button>
        </form>
    );
};

export default Form;
