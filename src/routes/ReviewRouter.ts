import { Router } from "express";
import upload from "../config/multer";
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
router.get(
  "/restaurant/:name/blog",
  auth,
  ReviewController.getReviewsFromNaver,
);

router.post(
  "/user/:userId/restaurant/:restaurantId",
  upload.array("image"),
  ReviewController.createReview,
);

export default router;
