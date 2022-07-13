import { Router } from "express";
import { TokenController } from "../controllers";
import UserController from "../controllers/UserController";

const router: Router = Router();

router.post("/", UserController.getUser);
router.get("/token", TokenController.getToken);
router.delete("/withdrawal/:userId", UserController.destroyUser);

export default router;
