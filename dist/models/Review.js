"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    restaurantId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    writerId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "User",
    },
    score: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
    },
    image: [{ type: String }],
    reason: [{ type: String }],
});
exports.default = mongoose_1.default.model("Review", ReviewSchema);
//# sourceMappingURL=Review.js.map