"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    prescriptions: [
        {
            type: mongoose_1.default.Types.ObjectId,
            required: true,
            ref: "Prescription",
        },
    ],
    isDiet: {
        type: Boolean,
        require: true,
    },
});
exports.default = mongoose_1.default.model("Category", CategorySchema);
//# sourceMappingURL=Category.js.map