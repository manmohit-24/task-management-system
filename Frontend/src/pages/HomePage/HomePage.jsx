import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { IconsDisplayAll } from "@/utils/Icons";

import ThemeToggle from "@/features/themes/components/ThemeToggle.jsx";
import Button from "@/features/auth/components/Button/Button";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="HomePageContainer">
            <h1>Welcome to the Todo App</h1>

            <Button onClick={() => navigate("login")}>Login / SignUp</Button>

            <ThemeToggle></ThemeToggle>
        </div>
    );
};

export default HomePage;
