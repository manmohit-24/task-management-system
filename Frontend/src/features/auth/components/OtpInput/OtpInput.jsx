import { useRef, useState } from "react";
import styles from "./OtpInput.module.css";

export default function OtpInput({ length = 4, onChange = () => {} }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    const focusInput = (index) => {
        if (index >= 0 && index < length) {
            inputsRef.current[index]?.focus();
        }
    };

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const digit = value.slice(-1);
        const updatedOtp = [...otp];
        updatedOtp[index] = digit;
        setOtp(updatedOtp);

        if (digit && index < length - 1) {
            focusInput(index + 1);
        }

        if (updatedOtp.every((num) => num !== "")) {
            onChange(updatedOtp.join(""));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const updatedOtp = [...otp];
                updatedOtp[index] = "";
                setOtp(updatedOtp);
            } else {
                focusInput(index - 1);
            }
        }

        if (e.key === "ArrowLeft") focusInput(index - 1);
        if (e.key === "ArrowRight") focusInput(index + 1);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

        if (!pastedData) return;

        const updatedOtp = Array(length).fill("");
        pastedData.split("").forEach((char, i) => {
            updatedOtp[i] = char;
        });

        setOtp(updatedOtp);

        const nextIndex = pastedData.length === length ? length - 1 : pastedData.length;
        focusInput(nextIndex);

        if (pastedData.length === length) {
            onChange(updatedOtp.join(""));
        }
    };

    return (
        <div className={styles.container}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={styles.input}
                />
            ))}
        </div>
    );
}
