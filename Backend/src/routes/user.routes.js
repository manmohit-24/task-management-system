import {Router} from "express"
import {logoutUser, refreshAccessToken, registerUser,getUserProfile,changeCurrentPassword, updateName, checkUniqueUsername, updateUsernameAndEmail} from "../controllers/user.controller.js"
import { loginUser } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/authMiddleware.js"
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = new Router();

router.route("/register").post(authLimiter,registerUser);

router.route("/login").post(authLimiter,loginUser);

router.route("/refreshToken").post(refreshAccessToken);

//* secured routes
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/me").get(verifyJWT,getUserProfile);

router.route("/change-password").post(verifyJWT,changeCurrentPassword);

router.route("/update-name").patch(verifyJWT,updateName);

router.route("/check-unique-username").get(checkUniqueUsername)

router.route("/update-username-email").patch(verifyJWT,updateUsernameAndEmail)

export default router;