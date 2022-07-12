//router index file
import { Router } from "express";
import AuthRouter from "./AuthRouter";
import RestaurantRouter from "./RestaurantRouter";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/restaurant", RestaurantRouter);

export default router;
