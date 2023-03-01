"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
exports.default = (req, res, next) => {
    const userId = req.params.userId;
    if (userId === "browsing") {
        next();
    }
    else {
        (0, auth_1.default)(req, res, next);
    }
};
//# sourceMappingURL=quarter.js.map