# TEAM Health-Food-Me
헬푸미 - "다이어터들의 외식 부담감 해결소 헬푸미"
<br/>

### ⚒️ Used Stacks
 ![Typescript](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
 ![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
 ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
 ![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white) 

<br/>

### 👥 Contributors
|이현우|김소현|
| :---: | :---: |
|<img src="https://user-images.githubusercontent.com/55437339/178451474-e8ba24b3-ea25-4d25-b46a-c0d33351e7de.jpeg" width="360"/>|<img src="https://user-images.githubusercontent.com/55437339/178452102-224590a4-4760-4736-9c7b-4f4a7fc3f270.jpeg" width="360"/>|
|[@l2hyunwoo](https://github.com/l2hyunwoo)|[@thguss](https://github.com/thguss)|

<br/>

### 💻 Roles
|기능명|엔드포인트|담당|구현 진척도|
| :---: | :---: | :---: | :---: |
|소셜 로그인|[POST] /auth|`김소현`|- [ ]|
|토큰 재발급|[GET] /auth/token|`김소현`|- [ ]|
|메인 지도 뷰|[GET] /restaurant?longtitude={위도}&latitude={위도}&zoom={반경범위}|`이현우`|
|식당 검색|[GET] /restaurant?query={검색어}|`이현우`|
|식당 간략 정보|[GET] /restaurant/:restaurantId|`김소현`|
|메뉴 상세 정보|[GET] /restaurant/:restaurantId/menus|`김소현`|
|외식 대처법|[GET] /restaurant/:restaurantId/dealing|`김소현`|
|헬푸미 리뷰|[GET] /restaurant/:restaurantId/reviews|`이현우`|
|블로그 리뷰|[GET] /restaurant/:restaurantId/reviews/blog|`이현우`|
|리뷰 작성|[POST] /user/:userId/:restaurantId/review|`이현우`|
|리뷰 삭제|[DELETE] /user/:userId/:restaurantId/review|`이현우`|
|리뷰 수정|[PUT] /user/:userId/:restaurantId/review|`이현우`|
|리뷰 모아보기|[GET] /user/:userId/:restaurantId/reviews|`이현우`|
|식당 스크랩 업데이트|[PUT] /user/:userId/scrap/:restaurantId|`김소현`|
|식당 스크랩 모아보기|[GET] /user/:userId/scraps|`김소현`|
|유저 프로필 보기|[GET] /user/:userId/profile|`김소현`|
|유저 프로필 변경|[PUT] /user/:userId/profile|`김소현`|
|회원탈퇴|[DELETE] /user/:userId/withdrawal|`김소현`|

### [📝 API Specification](https://chipped-hamburger-edb.notion.site/d615e5d9237c46f1861a4274c0379576?v=1201e0a5ad1f4caaa115b36c5766ecc5)

<br/>

### 
