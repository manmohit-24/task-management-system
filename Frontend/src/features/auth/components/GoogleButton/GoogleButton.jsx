import Button from "../Button/Button";
import { WorkInProgress } from "@/shared/components";
import styles from "./GoogleButton.module.css";
import { useNavigate } from "react-router-dom";
import { Google } from "@/shared/icons";

export default function GoogleButton() {
    const navigate = useNavigate();
    const GoogleLogin = async () => {
        navigate("/");
    };

    return (
        <div className={styles.wrapper}>
            <Button variant="secondary" onClick={GoogleLogin}>
                <Google size={20} />
                Continue with Google
            </Button>

            <div className={styles.tooltip}>
                <WorkInProgress />
            </div>
        </div>
    );
}
