import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";

const router = Router();

router.get("/:restaurantId/:userId", RestaurantController.getRestaurantSummary);

export default router;
