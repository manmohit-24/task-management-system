import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

//* Middleware
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/api/v1", globalLimiter);
// CORS
console.log(process.env.DB_NAME);

if (!process.env.CORS_ORIGINS) throw new Error("CORS_ORIGINS is not defined");

const allowedOrigins = process.env.CORS_ORIGINS.split(",").map((item) =>
    item.trim(),
);
app.use(
    cors({
        origin(origin, callback) {
            // allow if no origin ( api clients )
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) return callback(null, true);

            return callback(new Error("Not allowed by CORS"), false);
        },
        credentials: true,
    }),
);

//*********** importing router **********
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.route.js";
import todoRouter from "./routes/todo.route.js";
import sectionRouter from "./routes/section.route.js";

//*********** router declaration ********
app.use("/api/v1/users", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/section", sectionRouter);

//! this should be at the end to function properly
app.use(globalErrorHandler);

export { app };
