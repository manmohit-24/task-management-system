import { useRef, useState, useEffect } from "react";
import styles from "./OtpInput.module.css";
import Input from "../Input/Input";
export default function OtpInput({ length = 4, value = "", onChange = () => {} }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    const focusInput = (i) => {
        if (i >= 0 && i < length) {
            inputsRef.current[i]?.focus();
        }
    };

    useEffect(() => {
        const next = Array(length).fill("");
        value
            .slice(0, length)
            .split("")
            .forEach((char, i) => {
                next[i] = char;
            });

        setOtp(next);
    }, [value, length]);

    const updateOtp = (nextOtp) => {
        setOtp(nextOtp);
        onChange(nextOtp.join(""));
    };

    const handleChange = (rawValue, i) => {
        // only numbers allowed
        if (!/^\d*$/.test(rawValue)) return;

        const digit = rawValue.slice(-1);
        const nextOtp = [...otp];
        nextOtp[i] = digit;

        updateOtp(nextOtp);

        if (digit && i < length - 1) {
            focusInput(i + 1);
        }
    };

    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace") {
            if (otp[i]) {
                const updatedOtp = [...otp];
                updatedOtp[i] = "";
                setOtp(updatedOtp);
            } else {
                focusInput(i - 1);
            }
        }

        if (e.key === "ArrowLeft") focusInput(i - 1);
        if (e.key === "ArrowRight") focusInput(i + 1);
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
            {otp.map((digit, i) => (
                <Input
                    ref={(el) => (inputsRef.current[i] = el)}
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    className={styles.input}
                />
            ))}
        </div>
    );
}
