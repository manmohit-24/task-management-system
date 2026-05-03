import { forwardRef, useId } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(({ label, type = "text", className = "", watch, ...props }, ref) => {
    const id = useId();

    return (
        <div className={styles.container}>
            <input
                id={id}
                ref={ref}
                type={type}
                className={`${styles.input} ${className}`}
                placeholder=" "
                {...props}
            />
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
        </div>
    );
});

Input.displayName = "Input";

export default Input;
