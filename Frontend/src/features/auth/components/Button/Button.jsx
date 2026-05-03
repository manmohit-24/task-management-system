import styles from "./Button.module.css";

const Button = ({ text = "", className = "", ...props }) => {
    return (
        <div>
            <button className={`${className} ${styles.button}`} {...props}>
                {text}
            </button>
        </div>
    );
};

export default Button;
