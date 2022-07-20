import configMongoose from "../config/mongooseConfig";
import UserService from "../services/UserService";

describe("유저 프로필 조회 테스트", () => {
  test("GET /user/:userId/profile", async () => {
    configMongoose();
    const user = await UserService.getUserProfile("62d1c081c4beaf1e397b5d40");
    expect(user?._id).toBe("62d1c081c4beaf1e397b5d40");
    expect(user?.name).toBe("로리롤리");
  });
});

describe("유저 프로필 수정 테스트", () => {
  test("PUT /user/:userId/profile", async () => {
    configMongoose();
    const user = await UserService.updateUserProfile(
      "62d1c081c4beaf1e397b5d40",
      "크리넥스",
    );
    const result = {
      _id: "62d1c081c4beaf1e397b5d40",
      name: "크리넥스",
    };
    expect(user).toStrictEqual(result);
  });
});
