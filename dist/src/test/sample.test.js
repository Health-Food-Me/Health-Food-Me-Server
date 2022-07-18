"use strict";
/**
 * JS 계열에서 Test를 어떻게 사용하는 지 보여주는 예시 코드
 * <Description>
 * describe : 여러개의 테스트 케이스를 묶어 가독성을 높인다.
 * afterAll(fn, timeout) : 모든 테스트가 끝나고 실행된다
 * afterEach(fn, timeout) : 하나의 테스트가 끝날 때마다 실행된다
 * beforeAll(fn, timeout) : 모든 테스트가 시작하기 전에 한번 실행된다.
 * beforeEach(fn, timeout) : 하나의 테스트가 시작하기 전에 매번 실행한다
 */
describe("Calculate Unit Test", () => {
    test("1 + 1은 2이다", () => {
        const result = 1 + 1;
        expect(result).toBe(2);
    });
});
//# sourceMappingURL=sample.test.js.map