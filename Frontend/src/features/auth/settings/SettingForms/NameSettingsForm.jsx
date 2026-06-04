import styles from "./SettingsForms.module.css";
import { useUpdateName } from "../../hooks/auth.hook";

import { Form } from "@/features/auth";
import { toast } from "sonner";

export default function NameSettingsForm({ user }) {
    const { mutate: updateName } = useUpdateName({
        onError: (error) => toast.error(error.message, { toasterId: "modal" }),
        onSuccess: () => {
            toast.success("Name updated successfully", { toasterId: "modal" });
        },
    });

    const handleSubmit = (data) => {
        updateName({
            name: data.name,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <h3>Name</h3>
                <p>This name is displayed throughout the application.</p>
            </div>

            <Form
                values={{
                    name: user?.name ?? "",
                }}
                inputsFormat={[
                    {
                        name: "name",
                        label: "Display Name",
                        type: "text",
                    },
                ]}
                buttonText="Save Changes"
                onSubmit={handleSubmit}
            />
        </div>
    );
}
