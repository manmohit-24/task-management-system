import { Router } from "express";
import { createSection, getSections, updateSection, deleteSection } from "../controllers/section.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = new Router();

router.use(verifyJWT);  // All section routes need auth

router.route("/")
    .post(createSection)
    .get(getSections);

router.route("/:id")
    .patch(updateSection)
    .delete(deleteSection);

export default router;