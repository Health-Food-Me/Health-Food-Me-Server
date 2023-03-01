"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RestaurantController_1 = __importDefault(require("../controllers/RestaurantController"));
const quarter_1 = __importDefault(require("../middleware/quarter"));
const router = (0, express_1.Router)();
router.get("/search/auto", RestaurantController_1.default.getSearchAutoCompleteResult);
router.get("/search/card", RestaurantController_1.default.searchRestaurantCardList);
router.get("/search/category", RestaurantController_1.default.searchCategoryRestaurantList);
router.get("/:restaurantId/:userId/menus", quarter_1.default, RestaurantController_1.default.getMenuDetail);
router.get("/", RestaurantController_1.default.getAroundRestaurants);
router.get("/:restaurantId/prescription", RestaurantController_1.default.getPrescription);
router.get("/:restaurantId/:userId", quarter_1.default, RestaurantController_1.default.getRestaurantSummary);
exports.default = router;
//# sourceMappingURL=RestaurantRouter.js.map