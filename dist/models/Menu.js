"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MenuSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    kcal: {
        type: Number,
    },
    per: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    isPick: {
        type: Boolean,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Menu", MenuSchema);
//# sourceMappingURL=Menu.js.map