import { Router } from "express";
import multer from "../config/multer";
import { ReviewController } from "../controllers";
import auth from "../middleware/auth";

const router = Router();

router.get(
  "/restaurant/:restaurantId",
  auth,
  ReviewController.getReviewByRestaurant,
);
router.get("/user/:userId", auth, ReviewController.getReviewsByUser);
router.delete("/:reviewId/:restaurantId", ReviewController.deleteReview);
router.get(
  "/restaurant/:name/blog",
  auth,
  ReviewController.getReviewsFromNaver,
);

router.post(
  "/user/:userId/restaurant/:restaurantId",
  auth,
  multer.upload.array("image"),
  ReviewController.createReview,
);

router.put(
  "/:reviewId",
  auth,
  multer.upload.array("image"),
  ReviewController.updateReview,
);

export default router;
