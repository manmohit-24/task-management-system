import { useEffect, useState } from "react";
import { UserCog, LockKeyhole, LogOut, ChevronUp, SunMoon } from "lucide-react";
import { Dropdown, Avatar } from "@/features/shared/components";
import ThemeToggle from "@/features/themes/components/ThemeToggle";
import styles from "./ProfileMenu.module.css";
import { useSession, useLogout } from "@/features/auth/hooks/auth.hook";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const { data: user } = useSession();
    const name = user?.name || "User";
    const username = user?.username ? `@${user.username}` : "@username";
    const { mutate: logout, error } = useLogout({ onSuccess: () => navigate("/") });
    useEffect(() => {
        console.log(error);
    }, [error]);
    return (
        <Dropdown
            open={open}
            onOpenChange={setOpen}
            className={{
                trigger: styles.dropdownTrigger,
                menu: styles.dropdownMenu,
            }}
            trigger={
                <div
                    className={`${styles.profileTrigger} ${open ? styles.profileTriggerOpen : ""}`}
                >
                    <Avatar name={name} size="md" />
                    <div className={`${styles.userInfo} ${open ? styles.userInfoOpen : ""}`}>
                        <p>{name}</p>
                        <span>{username}</span>
                    </div>
                    <ChevronUp size={16} className={styles.chevron} />
                </div>
            }
        >
            <div className={styles.menu}>
                {/* Theme */}
                <div className={styles.theme}>
                    <div className={styles.label}>
                        <SunMoon size={18} />
                        <p>Theme :</p>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Profile */}
                <button className={styles.menuItem}>
                    <UserCog size={18} />
                    <span>Profile Settings</span>
                </button>

                {/* Password */}
                <button className={styles.menuItem}>
                    <LockKeyhole size={18} />
                    <span>Change Password</span>
                </button>

                <div className={styles.separator} />

                {/* Logout */}
                <button
                    className={`${styles.menuItem} ${styles.logout}`}
                    onClick={async () => logout()}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </Dropdown>
    );
}
