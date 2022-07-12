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

### ℹ️ Collection
```
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  social: {
    type: String,
    required: true,
    unique: true,
  },
  socialId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  scrapRestaurants: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
  ],
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
});
```
```
const ResaturantSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  hashtag: [
    {
      type: String,
      required: true,
    },
  ],
  address: {
    type: String,
    required: true,
  },
  worktime: [
    {
      type: String,
    },
  ],
  contact: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Review",
    },
  ],
  menus: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Menu",
    },
  ],
});
```
```
const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  nutrient: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Nutrient",
  },
  price: {
    type: Number,
    required: true,
  },
  from: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  isHelfoomePick: {
    type: Boolean,
    required: true,
  },
});
```
```
const NutrientSchema = new mongoose.Schema({
  kcal: {
    type: Number,
    required: true,
  },
  carbohydrate: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  menuId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Menu",
  },
});
```
```
const ReviewSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  writerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  score: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  reason: [
    {
      type: String,
      required: true,
    },
  ],
});
```
```
const DealingSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: url,
    required: true,
  },
});
```

<br/>

### 💻 Roles
|기능명|엔드포인트|담당|구현 진척도|
| :---: | :---: | :---: | :---: |
|소셜 로그인|[POST] /auth|`김소현`|✅|
|토큰 재발급|[GET] /auth/token|`김소현`|✅|
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

<br/>

### 📝 API Specification
[API 명세서](https://chipped-hamburger-edb.notion.site/d615e5d9237c46f1861a4274c0379576?v=1201e0a5ad1f4caaa115b36c5766ecc5)

<br/>

### 🧑‍💻 Code Convention

<details>
<summary>변수명</summary>   
<div markdown="1">       

 1. Camel Case 사용
 2. 함수의 경우 동사+명사 사용 ( ex) getUser() )
 3. 약어는 되도록 사용하지 않음
 
</div>
</details>

<details>
<summary>주석</summary>   
<div markdown="1">       

 1. 한 줄 주석 사용 //
 2. 함수 주석
 ```
 /**
 * @route
 * @desc
 * @access
 **/
 getUser()
 ```
 
</div>
</details>

이 외 ESLint 라이브러리 문법을 따른다.

<br/>

### 🎋 Branch Convention
|Branch 이름|용도|
| :--: | :--: |
|main|초기 세팅|
|develop|배포 branch (api 로직 구현 완료)|
|feature/#이슈번호|이슈별 api 로직 구현|

- feature -> development : Pull Request (코드 리뷰 없이 merge 불가)

<br/>

### ⬆️ Commit Convention
```
[브랜치 이름] 기능 (또는 변경사항) 간략 설명 (70자)

- 보충 설명이 필요한 경우
- Head에 한칸을 띄어서 작성

issue tracker: 이슈 번호 (option)
```

<br/>

### 📂 Folder Constructor
```
3-Layer Architecture 기반

📁 src
|_ 📁 config
|_ 📁 controllers
|_ 📁 interfaces
|_ 📁 models
|_ 📁 modules
|_ 📁 routes
|_ 📁 services
|_ 📁 test
|_ index.ts
```
