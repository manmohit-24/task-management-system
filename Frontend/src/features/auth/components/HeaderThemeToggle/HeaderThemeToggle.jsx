import { Moon, Sun } from "lucide-react";
import styles from "./HeaderThemeToggle.module.css";
import { useThemes } from "../../../themes/hooks/useTheme";

export default function HeaderThemeToggle() {
    const { userTheme, setUserTheme } = useThemes();

    let isDark = userTheme == "dark";
    const onToggleTheme = () => setUserTheme(isDark ? "light " : "dark");

    return (
        <button
            type="button"
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
