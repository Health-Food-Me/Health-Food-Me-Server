//router index file
import { Router } from "express";
import AuthRouter from "./AuthRouter";
import RestaurantRouter from "./RestaurantRouter";
import ReviewRouter from "./ReviewRouter";
import UserRouter from "./UserRouter";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/restaurant", RestaurantRouter);
router.use("/user", UserRouter);
router.use("/review", ReviewRouter);

export default router;
