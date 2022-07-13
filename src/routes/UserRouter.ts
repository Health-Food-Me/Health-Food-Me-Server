import { Router } from "express";
import { UserController } from "../controllers";
import auth from "../middleware/auth";

const router = Router();

router.put(
  "/:userId/scrap/:restaurantId",
  auth,
  UserController.scrapRestaurant,
);

export default router;
