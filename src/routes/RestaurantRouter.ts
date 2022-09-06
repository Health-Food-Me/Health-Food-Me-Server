import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";
import quarter from "../middleware/quarter";

const router = Router();

router.get("/search/auto", RestaurantController.getSearchAutoCompleteResult);
router.get("/search/card", RestaurantController.searchRestaurantCardList);

router.get(
  "/:restaurantId/:userId/menus",
  quarter,
  RestaurantController.getMenuDetail,
);

router.get("/", RestaurantController.getAroundRestaurants);
router.get("/:restaurantId/prescription", RestaurantController.getPrescription);

router.get(
  "/:restaurantId/:userId",
  quarter,
  RestaurantController.getRestaurantSummary,
);

export default router;
