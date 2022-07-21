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
const auth_1 = __importDefault(require("../config/auth"));
const mongooseConfig_1 = __importDefault(require("../config/mongooseConfig"));
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const UserService_1 = __importDefault(require("../services/UserService"));
describe("소셜 로그인 ", () => {
    test("POST /auth", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const social = yield auth_1.default.naverAuth("AAAAN6INYRxBNEKI4RAxIF6_cVfLUuogkOH_Axre5cMCBlekFQKZknC-e8QL_CTjAlE13ZdMH28qgxaj9Ox9ke4WO2Q");
        expect(social).toBeTruthy();
    }));
});
describe("토큰 재발급", () => {
    test("GET auth/token", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTgzNDQ0MTQsImV4cCI6MTY1OTU1NDAxNH0.n39SKQ2_zVJyLvtDMplbyBYjabZXs042kiY9TGjDAXs";
        const user = yield UserService_1.default.findUserByRfToken(refreshToken);
        expect(user).toBeTruthy();
    }));
});
describe("회원 탈퇴", () => {
    test("DELETE auth/withdrawal/:userId", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const result = yield UserService_1.default.withdrawUser("62d853de8587c83d07eba41d");
        expect(result).toBe(exceptionMessage_1.default.DELETE_USER);
    }));
});
//# sourceMappingURL=Auth.test.js.map