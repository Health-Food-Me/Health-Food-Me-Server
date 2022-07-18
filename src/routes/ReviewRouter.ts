import { Router } from "express";
import multer from "../config/multer";
import { ReviewController, UserController } from "../controllers";
import auth from "../middleware/auth";

const router = Router();

router.get(
  "/restaurant/:restaurantId",
  auth,
  ReviewController.getReviewByRestaurant,
);
router.get("/user/:userId", auth, ReviewController.getReviewsByUser);
router.delete("/:reviewId/:restaurantId", auth, ReviewController.deleteReview);
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

router.get("/check/:userId/:restaurantId", auth, UserController.getHasReviewed);

export default router;
