import styles from "./ProfileMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useSession, useLogout } from "@/features/auth/hooks/auth.hook";
import { useEffect, useMemo, useState } from "react";

import { ThemeToggle } from "@/shared/themes";
import { ActionsMenu, Avatar } from "@/shared/components";
import { UserCog, LogOut, ChevronUp, SunMoon } from "lucide-react";
import { toast } from "sonner";
import { AccountSettingsDialog } from "@/features/auth/settings";

export default function ProfileMenu() {
    const navigate = useNavigate();

    // ===== User Info =====
    const { data: user, error: sessionFetchError } = useSession();

    useEffect(() => {
        if (sessionFetchError) toast.error(sessionFetchError.message);
    }, [sessionFetchError]);

    const name = user?.name || "User";
    const username = user?.username ? `@${user.username}` : "@username";

    // ===== Logout =====
    const { mutate: logout } = useLogout({
        onSuccess: () => navigate("/login"),
        onError: (error) => {
            toast.error(error.message);
            navigate("/login");
        },
    });

    // ===== Settings Modals =====
    const [settingsOpen, setSettingsOpen] = useState(false);

    // ===== Menu Items =====
    const items = useMemo(
        () => [
            {
                type: "custom",
                content: (
                    <div className={styles.theme}>
                        <div className={styles.label}>
                            <SunMoon size={18} />
                            <p>Theme :</p>
                        </div>

                        <ThemeToggle />
                    </div>
                ),
            },

            {
                type: "action",
                label: "Account Settings",
                icon: UserCog,
                onClick: () => {
                    setSettingsOpen(true);
                },
            },

            { type: "separator" },

            {
                type: "action",
                label: "Logout",
                icon: LogOut,
                className: styles.logout,
                onClick: logout,
            },
        ],
        [logout],
    );

    return (
        <>
            <ActionsMenu items={items}>
                <div className={styles.profileTrigger}>
                    <Avatar name={name} size="md" />
                    {/* User info will visible when menu is in open state */}
                    <div className={styles.userInfo}>
                        <p>{name}</p>
                        <span>{username}</span>
                    </div>

                    <ChevronUp size={16} className={styles.chevron} />
                </div>
            </ActionsMenu>
            <AccountSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </>
    );
}
