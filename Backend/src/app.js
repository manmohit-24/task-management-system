import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

//* Middleware
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//*********** importing router **********
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.route.js";
import todoRouter from "./routes/todo.route.js";

//*********** router declaration ********
app.use("/api/v1/users", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/todo", todoRouter);

//! this should be at the end to function properly
app.use(globalErrorHandler);

export { app };
