import styles from "./Button.module.css";

const Button = ({ children, className = "", variant = "primary", ...props }) => {
    return (
        <button className={`${styles.button} ${className} ${styles[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
