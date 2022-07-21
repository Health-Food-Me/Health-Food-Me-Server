"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PrescriptionSchema = new mongoose_1.default.Schema({
    category: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    content: {
        recommend: [
            {
                type: String,
                required: true,
            },
        ],
        tip: [
            {
                type: String,
                require: true,
            },
        ],
    },
});
exports.default = mongoose_1.default.model("Prescription", PrescriptionSchema);
//# sourceMappingURL=Prescription.js.map