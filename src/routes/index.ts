//router index file
import { Router } from "express";
import AuthRouter from "./AuthRouter";
import RestaurantRouter from "./RestaurantRouter";
import UserRouter from "./UserRouter";
import DataRouter from "./DataRouter";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/restaurant", RestaurantRouter);
router.use("/user", UserRouter);

router.use("/data", DataRouter);

export default router;
