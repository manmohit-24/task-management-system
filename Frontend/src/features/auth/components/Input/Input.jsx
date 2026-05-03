import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Input.module.css";

const Input = forwardRef(({ label, type = "text", className = "", watch, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
        <div className={styles.container}>
            <input
                id={id}
                ref={ref}
                type={resolvedType}
                className={`${styles.input} ${isPassword ? styles.passwordInput : ""} ${className}`}
                placeholder=" "
                {...props}
            />

            <label className={styles.label} htmlFor={id}>
                {label}
            </label>

            {isPassword && (
                <button
                    type="button"
                    className={styles.toggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
