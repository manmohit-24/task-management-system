import Button from "../Button/Button";
import Icon from "@/utils/Icons";

export default function GoogleButton() {
    const GoogleLogin = async () => {
        // Backend Logic Here
    };

    return (
        <Button variant="secondary" onClick={GoogleLogin}>
            <Icon name={"IconGoogleLogo"} size={"M"} />
            Continue with Google
        </Button>
    );
}
