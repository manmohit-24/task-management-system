import { forwardRef, useEffect, useId, useState } from "react";
import "./Input.css";
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
        <div className="InputComponent">
            <label className={labelClassname} htmlFor={id}>
                {label}
            </label>
            <input id={id} type={type} ref={ref} {...props} />
        </div>
    );
});

export default Input;
