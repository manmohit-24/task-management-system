import { useEffect, useState } from "react";
import Input from "../Input/Input";
import { useUsernameAvailability } from "../../hooks/auth.hook";
import styles from "./UsernameField.module.css";

export default function UsernameField({
    name,
    label,
    type,
    register,
    watch,
    error,
    validations,
    dirtyFields,
    ...rest
}) {
    const username = watch(name);
    const [debouncedUsername, setDebouncedUsername] = useState("");
    const isDirty = dirtyFields?.[name];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUsername(username?.trim() || "");
        }, 400);

        return () => clearTimeout(timer);
    }, [username]);

    const shouldCheck = isDirty && debouncedUsername.length >= 3 && !error;

    const { data, isFetching } = useUsernameAvailability(debouncedUsername, shouldCheck);

    return (
        <>
            <Input
                label={label}
                type={type}
                watch={watch}
                {...rest}
                {...register(name, validations)}
            />

            <div className={styles.meta}>
                {error ? (
                    <span className={styles.error}>{error}</span>
                ) : !shouldCheck ? null : isFetching ? (
                    <span className={styles.checking}>Checking availability...</span>
                ) : data?.available ? (
                    <span className={styles.available}>Username is available</span>
                ) : (
                    <span className={styles.taken}>Username is already taken</span>
                )}
            </div>
        </>
    );
}
