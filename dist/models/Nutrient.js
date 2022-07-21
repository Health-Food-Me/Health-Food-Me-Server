"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NutrientSchema = new mongoose_1.default.Schema({
    kcal: {
        type: Number,
        required: true,
    },
    carbohydrate: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    fat: {
        type: Number,
        required: true,
    },
    menuId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Menu",
    },
});
exports.default = mongoose_1.default.model("Nutrient", NutrientSchema);
//# sourceMappingURL=Nutrient.js.map