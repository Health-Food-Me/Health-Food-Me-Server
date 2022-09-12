import { Router } from "express";
import { UserController } from "../controllers";
import auth from "../middleware/auth";

const router = Router();

router.put(
  "/:userId/scrap/:restaurantId",
  auth,
  UserController.scrapRestaurant,
);

router.get("/:userId/scrapList", auth, UserController.getUserScrapList);
router.get("/:userId/profile", auth, UserController.getUserProfile);

router.put("/:userId/profile", auth, UserController.updateUserProfile);
router.get("/check/:userId/:restaurantId", auth, UserController.getHasReviewed);
export default router;
