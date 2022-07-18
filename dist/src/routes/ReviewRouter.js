"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../config/multer"));
const controllers_1 = require("../controllers");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.get("/restaurant/:restaurantId", auth_1.default, controllers_1.ReviewController.getReviewByRestaurant);
router.get("/user/:userId", auth_1.default, controllers_1.ReviewController.getReviewsByUser);
router.delete("/:reviewId/:restaurantId", auth_1.default, controllers_1.ReviewController.deleteReview);
router.get("/restaurant/:name/blog", auth_1.default, controllers_1.ReviewController.getReviewsFromNaver);
router.post("/user/:userId/restaurant/:restaurantId", auth_1.default, multer_1.default.upload.array("image"), controllers_1.ReviewController.createReview);
router.put("/:reviewId", auth_1.default, multer_1.default.upload.array("image"), controllers_1.ReviewController.updateReview);
exports.default = router;
//# sourceMappingURL=ReviewRouter.js.map