import "./Button.css";

const Button = ({ text, className = "", ...props }) => {
    return (
        <div>
            <button className={`${className} ButtonComponent`} {...props}>
                {text}
            </button>
        </div>
    );
};

export default Button;
