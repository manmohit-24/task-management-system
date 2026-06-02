import styles from "./LoadingPage.module.css";

export default function LoadingPage() {
    return (
        <div className={styles.container}>
            <div className={styles.spinner} />
            <p className={styles.text}>Loading project...</p>
        </div>
    );
}
