import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";

const router = Router();

router.get("/search/auto", RestaurantController.getSearchAutoCompleteResult);
router.get("/search/card", RestaurantController.searchRestaurantCardList);
router.get("/:restaurantId/:userId/menus", RestaurantController.getMenuDetail);
router.get("/", RestaurantController.getAroundRestaurants);
router.get("/:restaurantId/prescription", RestaurantController.getPrescription);
router.get("/:restaurantId/:userId", RestaurantController.getRestaurantSummary);

export default router;
