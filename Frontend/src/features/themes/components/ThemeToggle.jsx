import { Sun, Moon, Monitor } from "lucide-react";
import styles from "./ThemeToggle.module.css";
import { useThemes } from "../hooks/useTheme";

const THEMES = [
    { id: "light", label: "Light", Icon: Sun },
    { id: "dark", label: "Dark", Icon: Moon },
    { id: "system", label: "System", Icon: Monitor },
];

export default function ThemeToggle() {
    const { userTheme, setUserTheme } = useThemes();

    const activeIndex = THEMES.findIndex(({ id }) => id === userTheme);

    return (
        <div className={styles.wrapper}>
            <div className={styles.track}>
                <div
                    className={styles.pill}
                    style={{ transform: `translateX(${activeIndex * 100}%)` }}
                />

                {THEMES.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setUserTheme(id)}
                        aria-pressed={userTheme === id}
                        className={`${styles.button} ${userTheme === id ? styles.active : ""}`}
                    >
                        <Icon size={16} strokeWidth={2.1} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
