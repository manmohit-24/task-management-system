import styles from "./SettingsForms.module.css";
import { useUpdateUsernameAndEmail } from "../../hooks/auth.hook";
import { useNavigate } from "react-router-dom";

import { Form } from "@/features/auth";
import UsernameField from "../../components/UsernameField/UsernameField";
import { toast } from "sonner";
import { Info } from "lucide-react";

export default function UsernameEmailSettingsForm({ user }) {
    const navigate = useNavigate();

    const { mutate: updateUsernameAndEmail } = useUpdateUsernameAndEmail({
        onError: (error) => toast.error(error.message, { toasterId: "modal" }),
        onSuccess: () => {
            // don't toast at toasterId : "modal" as navigation will close modal and toast will never appear
            toast.success("Identifiers updated successfully");
            navigate("/login");
        },
    });

    const handleSubmit = async (data) => {
        const { username, email, password } = data;

        const newUsername = username.trim() === user.username ? undefined : username.trim();
        const newEmail =
            email.trim().toLowerCase() === user.email ? undefined : email.trim().toLowerCase();

        if (!newEmail && !newUsername) {
            toast.error("Please provide a new email or username", {
                toasterId: "modal",
            });

            return;
        }

        updateUsernameAndEmail({
            email: newEmail,
            username: newUsername,
            password,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <h3>Account Information</h3>
                <p>Changing username or email requires your current password.</p>
            </div>

            <span className={styles.info}>
                <Info size={26} /> For security reasons, you will be signed out after updating your
                email or username.
            </span>

            <Form
                values={{
                    username: user?.username ?? "",
                    email: user?.email ?? "",
                }}
                inputsFormat={[
                    {
                        name: "username",
                        label: "Username",
                        type: "text",
                        component: UsernameField,
                    },
                    {
                        name: "email",
                        label: "Email",
                        type: "email",
                    },
                    {
                        name: "password",
                        label: "Current Password",
                        type: "password",
                    },
                ]}
                buttonText="Save Changes"
                onSubmit={handleSubmit}
            />
        </div>
    );
}
