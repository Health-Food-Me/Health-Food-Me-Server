import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";
import auth from "../middleware/auth";

const router = Router();

router.get(
  "/search/auto",
  auth,
  RestaurantController.getSearchAutoCompleteResult,
);

router.get("/search/card", auth, RestaurantController.searchRestaurantCardList);
router.get(
  "/:restaurantId/:userId/menus",
  auth,
  RestaurantController.getMenuDetail,
);

router.get("/", auth, RestaurantController.getAroundRestaurants);
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
