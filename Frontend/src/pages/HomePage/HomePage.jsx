import styles from "./HomePage.module.css";
import Icon from "@/utils/Icons";
import config from "@/app/config";
import Button from "@/features/auth/components/Button/Button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.logo}>
                    <Icon name="IconLogo" size="XL" />
                </div>

                <h1 className={styles.title}>{config.appName}</h1>

                <p className={styles.subtitle}>Organize work and life, simply. </p>

                <div className={styles.actions}>
                    <Button onClick={() => navigate("/login")}>Log In</Button>

                    <Button onClick={() => navigate("/register")} variant="secondary">
                        Create Account
                    </Button>
                </div>
            </section>
        </main>
    );
}
