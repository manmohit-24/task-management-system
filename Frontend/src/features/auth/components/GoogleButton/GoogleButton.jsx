import Button from "../Button/Button";
import Icon from "@/utils/Icons";
import styles from "./GoogleButton.module.css";

export default function GoogleButton() {
    const GoogleLogin = async () => {
        // Backend Logic Here
    };

    return (
        <Button
            text={<Icon name={"IconGoogleButton"} size={"M"} addionalclasses={styles.icon} />}
            style={{ "--bg": "white" }}
            onClick={GoogleLogin}
        />
    );
}
