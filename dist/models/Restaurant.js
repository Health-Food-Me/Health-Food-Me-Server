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
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: pointSchema,
        index: "2dsphere",
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
    category: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Category",
        },
    ],
    isDiet: {
        type: Boolean,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    menuBoard: [
        {
            type: String,
        },
    ],
    menu: [
        {
            type: mongoose_1.default.Types.ObjectId,
            required: true,
            ref: "Menu",
        },
    ],
    review: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Review",
        },
    ],
});
exports.default = mongoose_1.default.model("Restaurant", ResaturantSchema);
//# sourceMappingURL=Restaurant.js.map