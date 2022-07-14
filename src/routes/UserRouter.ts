import { Router } from "express";
import { UserController } from "../controllers";
import auth from "../middleware/auth";

const router = Router();

router.put(
  "/:userId/scrap/:restaurantId",
  auth,
  UserController.scrapRestaurant,
);

router.get("/:userId/scrapList", UserController.getUserScrpaList);
router.get("/:userId/profile", auth, UserController.getUserProfile);

export default router;
