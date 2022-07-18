"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logStream = exports.logger = void 0;
const winston_1 = __importStar(require("winston"));
const levelTransfer = (tag) => {
    switch (tag) {
        case "e":
            return "error";
        case "w":
            return "warn";
        case "i":
            return "info";
        case "d":
            return "debug";
        case "s":
            return "silly";
    }
};
const customLevels = {
    e: 0,
    w: 1,
    i: 2,
    d: 3,
    s: 4,
};
const customColors = {
    e: "red",
    w: "yellow",
    i: "cyan",
    d: "magenta",
    s: "gray",
};
winston_1.default.addColors(customColors);
exports.logger = (0, winston_1.createLogger)({
    levels: customLevels,
    format: winston_1.format.combine(winston_1.format.label({ label: "[NodeTemplate-Server]" }), winston_1.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.format.colorize(), winston_1.format.printf((info) => `${info.timestamp} - ${levelTransfer(info.level)}: ${info.label} ${info.message}`)),
    transports: [
        new winston_1.transports.Console({ level: "s" }),
        new winston_1.transports.File({ filename: "error.log", level: "e" }),
    ],
});
exports.logStream = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    write: (message) => {
        exports.logger.log("i", message);
    },
};
//# sourceMappingURL=winstonConfig.js.map