import { Input, Button, FileUpload } from "../../";
import styles from "./Form.module.css";
import { useForm } from "react-hook-form";

const Form = ({
    inputsFormat = [{ label: "label", type: "text", validations: {}, submitFile: () => {} }],
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

    const commonValidations = {
        email: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
            },
        },
        password: {
            required: "Password is required",
            minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
            },
        },
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
            {inputsFormat.map((field, i) => {
                const { validations: customValidations = {}, label, type, ...rest } = field;

                const lowerLabel = label.toLowerCase();

                const validations = {
                    required: false,
                    ...(commonValidations[lowerLabel] || {}),
                    ...customValidations,
                };

                if (type === "file")
                    return <FileUpload key={i} label={label} type={type} {...rest} />;

                return (
                    <div className={styles.input} key={i}>
                        <Input
                            label={label}
                            type={type}
                            {...rest}
                            {...register(lowerLabel, validations)}
                            watch={watch}
                        />

                        <div className={styles.error}>{errors[lowerLabel]?.message}</div>
                    </div>
                );
            })}

            <Button text={buttonText} type="submit" style={buttonStyle} />
        </form>
    );
};

export default Form;
