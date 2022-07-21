"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//router index file
const express_1 = require("express");
const AuthRouter_1 = __importDefault(require("./AuthRouter"));
const RestaurantRouter_1 = __importDefault(require("./RestaurantRouter"));
const ReviewRouter_1 = __importDefault(require("./ReviewRouter"));
const UserRouter_1 = __importDefault(require("./UserRouter"));
const router = (0, express_1.Router)();
router.use("/auth", AuthRouter_1.default);
router.use("/restaurant", RestaurantRouter_1.default);
router.use("/user", UserRouter_1.default);
router.use("/review", ReviewRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map