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
    nutrient: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Nutrient",
    },
    price: {
        type: Number,
        required: true,
    },
    from: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    isHelfoomePick: {
        type: Boolean,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Menu", MenuSchema);
//# sourceMappingURL=Menu.js.map