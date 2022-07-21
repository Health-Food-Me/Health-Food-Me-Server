import auth from "../config/auth";
import configMongoose from "../config/mongooseConfig";
import exceptionMessage from "../modules/exceptionMessage";
import UserService from "../services/UserService";

describe("소셜 로그인 ", () => {
  test("POST /auth", async () => {
    configMongoose();
    const social = await auth.naverAuth(
      "AAAAN6INYRxBNEKI4RAxIF6_cVfLUuogkOH_Axre5cMCBlekFQKZknC-e8QL_CTjAlE13ZdMH28qgxaj9Ox9ke4WO2Q",
    );

    expect(social).toBeTruthy();
  });
});

describe("토큰 재발급", () => {
  test("GET auth/token", async () => {
    configMongoose();
    const refreshToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTgzNDQ0MTQsImV4cCI6MTY1OTU1NDAxNH0.n39SKQ2_zVJyLvtDMplbyBYjabZXs042kiY9TGjDAXs";
    const user = await UserService.findUserByRfToken(refreshToken);
    expect(user).toBeTruthy();
  });
});

describe("회원 탈퇴", () => {
  test("DELETE auth/withdrawal/:userId", async () => {
    configMongoose();
    const result = await UserService.withdrawUser("62d853de8587c83d07eba41d");
    expect(result).toBe(exceptionMessage.DELETE_USER);
  });
});
