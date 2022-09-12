import { Router } from "express";
import multer from "../config/multer";
import { ReviewController, UserController } from "../controllers";
import auth from "../middleware/auth";

const router = Router();

router.get("/restaurant/:restaurantId", ReviewController.getReviewByRestaurant);
router.get("/user/:userId", auth, ReviewController.getReviewsByUser);
router.delete("/:reviewId", auth, ReviewController.deleteReview);
router.get("/restaurant/:name/blog", ReviewController.getReviewsFromNaver);

router.post(
  "/:userId/:restaurantId",
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
