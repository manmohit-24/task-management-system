import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { IconsDisplayAll } from "@/utils/Icons";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* <IconsDisplayAll />*/}

            <div className="HomePageContainer">
                <h1>Welcome to the Todo App</h1>

                <button
                    onClick={() => {
                        navigate("login");
                    }}
                >
                    Login / Signup
                </button>
            </div>
        </>
    );
};

export default HomePage;
