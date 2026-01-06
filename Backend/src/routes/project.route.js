import { Router } from "express";
import { createProject, getAllProjects,updateProject,deleteProject } from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

//* All project routes need authentication

router.route("/").post(verifyJWT,createProject)
                .get(verifyJWT,getAllProjects);

router.route("/:id").patch(verifyJWT,updateProject)
                    .delete(verifyJWT,deleteProject);
                    
export default router