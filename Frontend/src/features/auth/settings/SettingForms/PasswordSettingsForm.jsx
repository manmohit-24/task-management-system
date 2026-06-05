import styles from "./SettingsForms.module.css";
import { useNavigate } from "react-router-dom";
import { useChangePassword } from "../../hooks/auth.hook";

import { Form } from "@/features/auth";
import { toast } from "sonner";
import { Info } from "lucide-react";

export default function PasswordSettingsForm() {
    const navigate = useNavigate();

    const { mutate: updatePassword } = useChangePassword({
        onError: (error) => toast.error(error.message, { toasterId: "modal" }),
        onSuccess: () => {
            // don't toast at toasterId : "modal" as navigation will close modal and toast will never appear
            toast.success("Password updated successfully");
            navigate("/login");
        },
    });

    const handleSubmit = async (data) => {
        const { currentPassword, newPassword } = data;
        updatePassword({ oldPassword: currentPassword, newPassword });
    };

    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <h3>Password</h3>
                <p>Use a strong password that you do not use elsewhere.</p>
            </div>

            <span className={styles.info}>
                <Info size={26} /> For security reasons, you will be signed out after updating your
                Password
            </span>

            <Form
                inputsFormat={[
                    {
                        name: "currentPassword",
                        label: "Current Password",
                        type: "password",
                    },
                    {
                        name: "newPassword",
                        label: "New Password",
                        type: "password",
                    },
                    {
                        name: "confirmPassword",
                        label: "Confirm Password",
                        type: "password",
                        validations: {
                            required: "Confirm Password is required",
                            validate: (value, formValues) =>
                                value === formValues.newPassword || "Passwords do not match",
                        },
                    },
                ]}
                buttonText="Update Password"
                onSubmit={handleSubmit}
            />
        </div>
    );
}
