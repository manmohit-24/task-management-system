import Button from "../Button/Button";
import Icon from "@/utils/Icons";
import WorkInProgress from "@/components/WorkInProgress/WorkInProgress";
import styles from "./GoogleButton.module.css";
import { useNavigate } from "react-router-dom";

export default function GoogleButton() {
    const navigate = useNavigate();
    const GoogleLogin = async () => {
        navigate("/");
    };

    return (
        <div className={styles.wrapper}>
            <Button variant="secondary" onClick={GoogleLogin}>
                <Icon name="IconGoogleLogo" size="M" />
                Continue with Google
            </Button>

            <div className={styles.tooltip}>
                <WorkInProgress />
            </div>
        </div>
    );
}
