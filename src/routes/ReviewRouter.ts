import { Router } from "express";
import { ReviewController } from "../controllers";
import auth from "../middleware/auth";

const router = Router();

router.get(
  "/restaurant/:restaurantId",
  auth,
  ReviewController.getReviewByRestaurant,
);
router.get("/user/:userId", auth, ReviewController.getReviewsByUser);
router.delete("/:reviewId", auth, ReviewController.deleteReview);

export default router;
