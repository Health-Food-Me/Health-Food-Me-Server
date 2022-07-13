//router index file
import { Router } from "express";
import AuthRouter from "./AuthRouter";
import RestaurantRouter from "./RestaurantRouter";
import UserRouter from "./UserRouter";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/restaurant", RestaurantRouter);
router.use("/user", UserRouter);

export default router;
