import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./app/routes";

import "./Themes/Light.css";
// import "./Themes/Dark.css";
import "./Themes/Mutual.css";
import "./utils/Icons.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AppRouter />
    </StrictMode>,
);
