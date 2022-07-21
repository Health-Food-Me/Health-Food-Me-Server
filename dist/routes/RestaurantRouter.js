"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RestaurantController_1 = __importDefault(require("../controllers/RestaurantController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.get("/search/auto", auth_1.default, RestaurantController_1.default.getSearchAutoCompleteResult);
router.get("/search/card", auth_1.default, RestaurantController_1.default.searchRestaurantCardList);
router.get("/:restaurantId/:userId/menus", auth_1.default, RestaurantController_1.default.getMenuDetail);
router.get("/", auth_1.default, RestaurantController_1.default.getAroundRestaurants);
router.get("/:restaurantId/prescription", auth_1.default, RestaurantController_1.default.getPrescription);
router.get("/:restaurantId/:userId", auth_1.default, RestaurantController_1.default.getRestaurantSummary);
exports.default = router;
//# sourceMappingURL=RestaurantRouter.js.map