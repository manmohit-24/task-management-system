import styles from "./AccountSettingsDialog.module.css";
import { useState } from "react";
import { Button } from "@/features/auth";

import { Modal } from "@/shared/components";
import { X } from "lucide-react";
import { NameSettingsForm, UsernameEmailSettingsForm, PasswordSettingsForm } from ".";
import { useSession } from "../hooks/auth.hook";
import { Toaster } from "sonner";

const tabs = [
    {
        id: "name",
        label: "Name",
    },
    {
        id: "account",
        label: "Account",
    },
    {
        id: "password",
        label: "Password",
    },
];

export default function AccountSettingsDialog({ open, onOpenChange }) {
    const [activeTab, setActiveTab] = useState("name");
    const { data: user } = useSession();

    // we used this conditional rendering of forms here so that forms will re-render with default data
    // the Form component used in these forms not expose reset feature
    // also it unmounts the toaster so in next open , old toast will not still be hanging
    if (!open) return null;

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            closeOnBackdrop={false}
            closeOnEscape={false}
            className={styles.modal}
        >
            {/*
              Creating a modal level toaster to make the toast visiblt at top of modal
              Global toast mounts under <div id="root"> while dialog mounts on top of it ( browser top layer),
              so global toast got blurred in backdrop too.

              This one mounts to dialog itself, so always at top of content.
              We modified the css styles of this modal to make it wrap full screen and toast will position correctly
            */}

            <Toaster
                id="modal"
                toastOptions={{
                    style: {
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        border: "0.1rem solid var(--border-subtle)",
                        borderRadius: "1rem",
                    },
                }}
            />
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div>
                            <h2>Account Settings</h2>
                        </div>

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => onOpenChange(false)}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className={styles.tabs}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.content}>
                        {activeTab === "name" && <NameSettingsForm user={user} />}
                        {activeTab === "account" && <UsernameEmailSettingsForm user={user} />}
                        {activeTab === "password" && <PasswordSettingsForm />}

                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
