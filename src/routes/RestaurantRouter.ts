import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";
import auth from "../middleware/auth";

const router = Router();

router.get(
  "/:restaurantId/prescription",
  auth,
  RestaurantController.getPrescription,
);

router.get(
  "/:restaurantId/:userId",
  auth,
  RestaurantController.getRestaurantSummary,
);

export default router;
