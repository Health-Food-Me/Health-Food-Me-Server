import { Router } from "express";
import { ReviewController } from "../controllers";
import { body } from "express-validator/check";

import auth from "../middleware/auth";
import upload from "../config/multer";

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
