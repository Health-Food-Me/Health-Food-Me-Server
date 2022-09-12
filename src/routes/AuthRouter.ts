import { Router } from "express";
import { TokenController } from "../controllers";
import UserController from "../controllers/UserController";
import auth from "../middleware/auth";

const router: Router = Router();

router.post("/", UserController.getUser);
router.get("/token", TokenController.getToken);
router.delete("/withdrawal/:userId", auth, UserController.withdrawUser);

export default router;
