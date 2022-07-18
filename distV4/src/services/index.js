"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RestaurantService_1 = __importDefault(require("./RestaurantService"));
const ReviewService_1 = __importDefault(require("./ReviewService"));
const UserService_1 = __importDefault(require("./UserService"));
exports.default = {
    UserService: UserService_1.default,
    RestaurantService: RestaurantService_1.default,
    ReviewService: ReviewService_1.default,
};
//# sourceMappingURL=index.js.map