import styles from "./HomePage.module.css";
import config from "@/app/config";
import Button from "@/features/auth/components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useSession, useLogout } from "@/features/auth/hooks/auth.hook";
import { Logo } from "@/shared/icons";

export default function HomePage() {
    const navigate = useNavigate();
    const { data: user } = useSession();

    const { mutate: logout } = useLogout({
        onSuccess: () => navigate("/login"),
    });
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <Logo size={56} />
                <h1 className={styles.title}>{config.appName}</h1>

                <p className={styles.subtitle}>Organize work and life, simply. </p>

                <div className={styles.actions}>
                    {user ? (
                        <>
                            <p>
                                Welcome Back <b>{user.name}</b> !!! Continue You Goals
                            </p>
                            <Button onClick={() => navigate("/app/today")}>
                                Continue to tasks
                            </Button>
                            <Button variant="secondary" onClick={async () => logout()}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => navigate("/login")}>Log In</Button>
                            <Button onClick={() => navigate("/register")} variant="secondary">
                                Create Account
                            </Button>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
