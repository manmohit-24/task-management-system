import styles from "./ThemeToggle.module.css";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, THEMES as providerThemes } from "../ThemesProvider";

const THEMES = [
    { id: providerThemes.LIGHT, label: "Light", icon: Sun },
    { id: providerThemes.DARK, label: "Dark", icon: Moon },
    { id: providerThemes.SYSTEM, label: "System", icon: Monitor },
];

export default function ThemeToggle({ variant = "pilled" }) {
    const { theme, setTheme } = useTheme();

    const activeIndex = Math.max(
        THEMES.findIndex(({ id }) => id === theme),
        0,
    );

    const cycleTheme = () => {
        const nextIndex = (activeIndex + 1) % THEMES.length;
        setTheme(THEMES[nextIndex].id);
    };

    // ===== Circular Icon Toggle =====
    if (variant === "icon") {
        const CurrentIcon = THEMES[activeIndex].icon;

        return (
            <button
                type="button"
                className={styles.iconToggle}
                onClick={cycleTheme}
                aria-label={`Current theme: ${theme}`}
                title={`Current theme: ${theme}`}
            >
                <CurrentIcon size={18} />
            </button>
        );
    }

    // ===== Pilled Theme Toggle =====
    return (
        <div className={styles.wrapper}>
            <div className={styles.track}>
                <div
                    className={styles.pill}
                    style={{
                        transform: `translateX(${activeIndex * 100}%)`,
                    }}
                />

                {THEMES.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTheme(id)}
                        aria-pressed={theme === id}
                        className={`${styles.button} ${theme === id ? styles.active : ""}`}
                    >
                        <Icon size={18} strokeWidth={1.9} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
