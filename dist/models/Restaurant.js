"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pointSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});
const ResaturantSchema = new mongoose_1.default.Schema({
    location: {
        type: pointSchema,
        index: "2dsphere",
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    address: {
        type: String,
        required: true,
    },
    workTime: [
        {
            type: String,
        },
    ],
    contact: {
        type: String,
    },
    reviews: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Review",
        },
    ],
    menus: [
        {
            type: mongoose_1.default.Types.ObjectId,
            required: true,
            ref: "Menu",
        },
    ],
});
exports.default = mongoose_1.default.model("Restaurant", ResaturantSchema);
//# sourceMappingURL=Restaurant.js.map