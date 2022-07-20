import configMongoose from "../config/mongooseConfig";
import UserService from "../services/UserService";

describe("유저 프로필 조회 테스트", () => {
  test("GET /user/:userId/profile", async () => {
    configMongoose();
    const user = await UserService.getUserProfile("62d1c081c4beaf1e397b5d40");
    expect(user?._id).toBe("62d1c081c4beaf1e397b5d40");
    expect(user?.name).toBe("헬푸미2342999768");
  });
});
