import styles from "./Button.module.css";

const Button = ({ children, className = "", variant = "primary", ...props }) => {
    return (
        <div>
            <button className={`${styles.button} ${className} ${styles[variant]}`} {...props}>
                {children}
            </button>
        </div>
    );
};

export default Button;
