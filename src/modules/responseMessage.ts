const message = {
  NULL_VALUE: "필요한 값이 없습니다.",
  FORBIDDEN: "Forbidden",
  DUPLICATED: "Duplicated",
  NOT_FOUND: "존재하지 않는 자원",
  BAD_REQUEST: "잘못된 요청",
  INTERNAL_SERVER_ERROR: "서버 내부 오류",
  INVALID_PASSWORD: "비밀번호 오류",
  NULL_VALUE_PARAM: "param 값이 없음",
  NO_USER: "존재하지 않은 유저",

  //token
  NULL_VALUE_TOKEN: "토큰이 없음",
  INVALID_TOKEN: "유효하지 않은 토큰",
  VALID_TOKEN: "유효한 토큰",
  CREATE_TOKEN_SUCCESS: "토큰 재발급 성공",
  EXPIRED_TOKEN: "만료된 토큰",

  // social
  UNAUTHORIZED_SOCIAL_USER: "유효하지 않은 소셜 유저",

  // image
  CREATE_FILE_SUCCESS: "이미지 업로드 성공",
  CREATE_FEED_SUCCESS: "피드 업로드 성공",
  GET_FEED_SUCCESS: "피드 조회 성공",
  READ_IMAGES_SUCCESS: "이미지 조회 성공",

  // auth
  SIGN_IN_SUCCESS: "로그인 성공",
  SIGN_UP_SUCCESS: "회원가입 성공",

  //restaurant
  READ_RESTAURANT_SUMMARY_SUCCESS: "식당 요약 정보 조회 성공",
  READ_RESTAURANT_MENU_SUCCESS: "식당 상세 메뉴 정보 조회 성공",
  UPDATE_SCRAP_SUCCESS: "식당 스크랩 업데이트 성공",
  SEARCH_RESTAURANT_CARD_SUCCESS: "식당 카드 검색 성공",
  AUTO_KEYWORD_SEARCH_RESTAURANT_SUCCESS: "식당 자동검색 성공",

  // user
  READ_USER_PROFILE_SUCCESS: "유저 프로필 조회 성공",
  UPDATE_USER_PROFILE_SUCCESS: "유저 프로필 수정 성공",
  DELETE_USER_SUCCESS: "회원탈퇴 성공",
  DUPLICATE_USER_NAME: "동일한 유저 이름 존재",
  READ_SCRAP_LIST_SUCCESS: "스크랩 식당 리스트 조회 성공",
  READ_AROUND_RESTAURANT_SUCCESS: "주변 식당 조회 성공",

  // review
  READ_REVIEWS_BY_RESTAURANT: "식당 리뷰 조회 성공",
  READ_REVIEWS_BY_USER: "내가 쓴 리뷰 조회 성공",
  READ_REVIEWS_FROM_NAVER: "네이버 블로그 리뷰 조회 성공",
  DELETE_REVIEW: "리뷰 삭제 성공",

  // prescription
  READ_PRESCRIPTION_SUCCESS: "외식 대처법 조회 성공",
};

export default message;
