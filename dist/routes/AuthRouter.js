"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/", UserController_1.default.getUser);
router.get("/token", controllers_1.TokenController.getToken);
exports.default = router;
//# sourceMappingURL=AuthRouter.js.map