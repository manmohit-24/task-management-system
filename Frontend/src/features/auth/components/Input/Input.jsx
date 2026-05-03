import { forwardRef, useEffect, useId, useState } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(({ label, type = "text", watch, ...props }, ref) => {
    const id = useId();

    const [labelClassname, setLabelClassname] = useState("passive");

    const name = props.name;

    useEffect(() => {
        let val = watch(name);

        if (val == "") setLabelClassname("passive");
        else setLabelClassname("active");
    }, [watch(name)]);

    return (
        <div className={styles.input}>
            <label className={labelClassname} htmlFor={id}>
                {label}
            </label>
            <input id={id} type={type} ref={ref} {...props} />
        </div>
    );
});

Input.displayName = Input;

export default Input;
