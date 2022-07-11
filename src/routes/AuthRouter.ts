import { Router } from "express";
import UserController from "../controllers/UserController";
import { TokenController } from "../controllers";

const router: Router = Router();

router.post("/", UserController.getUser);
router.get("/token", TokenController.getToken);

export default router;
