import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";
import auth from "../middleware/auth";

const router = Router();

router.get("/:restaurantId/menus", auth, RestaurantController.getMenuDetail);
router.get("/", auth, RestaurantController.getAroundRestaurants);
router.get(
  "/:restaurantId/:userId",
  auth,
  RestaurantController.getRestaurantSummary,
);

export default router;
