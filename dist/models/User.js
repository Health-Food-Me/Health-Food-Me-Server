"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    social: {
        type: String,
        required: true,
    },
    socialId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
    },
    scrapRestaurants: [
        {
            type: mongoose_1.default.Types.ObjectId,
            required: true,
            ref: "Restaurant",
        },
    ],
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Review",
        },
    ],
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map