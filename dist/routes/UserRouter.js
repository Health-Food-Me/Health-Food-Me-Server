"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.put("/:userId/scrap/:restaurantId", auth_1.default, controllers_1.UserController.scrapRestaurant);
router.get("/:userId/scrapList", controllers_1.UserController.getUserScrpaList);
router.get("/:userId/profile", auth_1.default, controllers_1.UserController.getUserProfile);
router.put("/:userId/profile", auth_1.default, controllers_1.UserController.updateUserProfile);
exports.default = router;
//# sourceMappingURL=UserRouter.js.map