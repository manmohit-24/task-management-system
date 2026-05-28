import { useEffect, useState, useId } from "react";
import styles from "./FileUpload.module.css";

const FileUpload = ({ submitFile, label, init = undefined, ...props }) => {
    const id = useId();
    const [uploadedFile, setUploadedFile] = useState("");
    const [fileURL, setFileURL] = useState("");

    useEffect(() => {
        submitFile(uploadedFile);
        // console.log(uploadedFile);

        if (uploadedFile) {
            let reader = new FileReader();
            reader.readAsDataURL(uploadedFile);
            reader.onload = () => {
                setFileURL(reader.result);
            };
        }
    }, [uploadedFile]);

    useEffect(() => {
        if (init) {
            // setFileURL(storageService.getPreview(init, 1920)[0]);
        }
    }, [init]);

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        setUploadedFile(files[0]);
    };

    const handleClick = (event) => {
        const files = event.target.files;
        setUploadedFile(files[0]);
    };

    const handleRemoveFile = () => {
        setUploadedFile("");
        setFileURL("");
    };

    return (
        <div
            className={styles.container}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            {...props}
        >
            <span className={styles.heading}>{label}</span>

            {fileURL ? (
                <>
                    <button onClick={handleRemoveFile} className={styles.cross}>
                        X
                    </button>
                    <img src={fileURL} alt="Cover-Image" />
                </>
            ) : (
                <>
                    <label htmlFor={id} className={styles.label}>
                        Drag and drop files here or click to browse
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleClick}
                        id={id}
                        className={styles.input}
                    />
                </>
            )}
            {/* <div className="file-list"></div> */}
        </div>
    );
};

export default FileUpload;
