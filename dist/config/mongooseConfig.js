"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = __importDefault(require("."));
const winstonConfig_1 = require("./winstonConfig");
const configMongoose = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.MODE_ENV !== "production") {
        mongoose_1.default.set("debug", true);
    }
    mongoose_1.default.connect(_1.default.mongoURI, {
        // dbname: 'DBName',
        autoCreate: true,
    }, (error) => {
        if (error) {
            winstonConfig_1.logger.e("MongoDB Init Error");
        }
        else {
            winstonConfig_1.logger.i("MonogDB Init Success!!");
        }
    });
    // TODO Collection Create Logic
});
mongoose_1.default.connection.on("error", (error) => {
    winstonConfig_1.logger.e("MongoDB Connection Error", error);
});
mongoose_1.default.connection.on("disconnected", () => {
    winstonConfig_1.logger.e("MongoDB Disconnected. Try Connect");
    configMongoose();
});
exports.default = configMongoose;
//# sourceMappingURL=mongooseConfig.js.map