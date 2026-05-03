import { Input, Button, FileUpload, OtpInput } from "../../";
import styles from "./Form.module.css";
import { useForm, Controller } from "react-hook-form";
import getValidationSchemas from "../../libs/getValidationSchemas";

const Form = ({
    inputsFormat = [
        {
            name: "field",
            label: "Label",
            type: "text",
            validations: {},
        },
    ],
    values = {},
    buttonText,
    buttonStyle = {},
    onSubmit = () => {},
    className = "",
}) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: values });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${styles.container} ${className}`}>
            {inputsFormat.map((config, i) => {
                const {
                    name = "",
                    label = "",
                    type = "text",
                    validations: customValidations = {},
                    ...rest
                } = config;

                const validations = {
                    ...(getValidationSchemas(name) || {}),
                    ...customValidations,
                };

                if (type === "file")
                    return (
                        <FileUpload
                            key={name || i}
                            name={name}
                            label={label}
                            type={type}
                            {...rest}
                        />
                    );

                if (type === "otp") {
                    return (
                        <div className={styles.otp} key={name || i}>
                            <Controller
                                name={name}
                                control={control}
                                rules={validations}
                                render={({ field }) => (
                                    <OtpInput
                                        length={rest.length || 4}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <div className={styles.error}>{errors[name]?.message}</div>
                        </div>
                    );
                }

                return (
                    <div className={styles.input} key={name || i}>
                        <Input
                            label={label}
                            type={type}
                            {...rest}
                            {...register(name, validations)}
                        />

                        <div className={styles.error}>{errors[name]?.message}</div>
                    </div>
                );
            })}

            <Button type="submit" style={buttonStyle}>
                {buttonText}
            </Button>
        </form>
    );
};

export default Form;
