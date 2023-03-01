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
Object.defineProperty(exports, "__esModule", { value: true });
const adjective = [
    "풀먹는",
    "먹이찾는",
    "배부른",
    "배고픈",
    "행복한",
    "활동적인",
    "강한",
    "게으른",
    "고마운",
    "궁금한",
    "귀여운",
    "그리운",
    "급한",
    "기쁜",
    "깊은",
    "느린",
    "늦은",
    "달달한",
    "답답한",
    "더운",
    "따뜻한",
    "똑똑한",
    "통통한",
    "뜨거운",
    "반가운",
    "맑은",
    "복잡한",
    "부끄러운",
    "부러운",
    "부지런한",
    "분명한",
    "불쌍한",
    "빠른",
    "섭섭한",
    "소중한",
    "시끄러운",
    "시원한",
    "심심한",
    "쌀쌀한",
    "아름다운",
    "알맞은",
    "재밌는",
    "어두운",
    "재밌는",
    "외로운",
    "익숙한",
    "잘생긴",
    "즐거운",
    "착한",
    "친절한",
    "특별한",
    "튼튼한",
    "편안한",
    "한가한",
    "화려한",
    "훌륭한",
    "건강한",
    "균형잡힌",
    "가벼운",
    "생생한",
    "향긋한",
    "활발한",
];
const noun = [
    "닭가슴살",
    "계란",
    "바나나",
    "고구마",
    "곤약",
    "아보카도",
    "옥수수",
    "연어",
    "두부",
    "머쉬룸",
    "비프",
    "바질",
    "그래놀라",
    "크림스프",
    "데리야끼",
    "리코타",
    "루꼴라",
    "카프리제",
    "새우",
    "단호박",
    "크랜베리",
    "올리브",
    "병아리콩",
    "부리타",
    "양배추",
    "토마토",
    "파게로",
    "카이피라",
    "그린레이스",
    "멀티그린",
    "멀티레드",
    "로메인",
    "버터헤드",
    "샐러리",
    "치커리",
    "라디치오",
    "로즈케일",
    "프리세",
    "비트",
    "푸실리",
    "청경채",
    "슈가로프",
    "코스타마리",
    "케일",
    "트레비소",
    "백로즈",
    "뉴그린",
    "적로즈",
    "곰취",
    "다시마",
    "와사비",
];
const createRandomName = () => __awaiter(void 0, void 0, void 0, function* () {
    adjective.sort(() => Math.random() - 0.5);
    noun.sort(() => Math.random() - 0.5);
    const name = `${adjective[0]} ${noun[0]}`;
    return name;
});
exports.default = { createRandomName };
//# sourceMappingURL=randomName.js.map