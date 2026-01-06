import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo, toggleTodo, restoreTodo } from "../controllers/todo.controller.js";

const router = Router();

//* all to-do routes need authentication

router.use(verifyJWT);

router.route("/").post(createTodo)
                 .get(getTodos);

router.route("/:id").get(getTodoById)
                    .patch(updateTodo)
                    .delete(deleteTodo);

router.route("/:id/toggle").patch(toggleTodo);
router.route("/:id/restore").patch(restoreTodo);

export default router;