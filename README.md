# TEAM Health-Food-Me
![앱 소개 페이지](https://user-images.githubusercontent.com/55437339/180312067-e4a2ea70-59d9-4a98-8095-5e685115b0db.png)
- 현재 위치를 기반으로 건강 식단을 챙길 수 있는 주변의 식당 정보들을 제공합니다.
- 약속에 나갈 때도 건강한 한 끼를 챙길 수 있도록 헬푸미에서 식당과 메뉴를 추천해드립니다.
- 식당별로 마음 놓고 즐길 수 있도록 외식 대처법을 제공합니다.

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

### ℹ️ Collection
<details>
<summary>User</summary>   
<div markdown="1">       

```typescript
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  social: {
    type: String,
    required: true,
  },
  socialId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
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
</div>
</details>

<details>
<summary>Restaurant</summary>   
<div markdown="1">   
 
```typescript
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
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Category",
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
</div>
</details>

<details>
<summary>Menu</summary>   
<div markdown="1">  
 
```typescript
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
</div>
</details>

<details>
<summary>Nutrient</summary>   
<div markdown="1">  
 
```typescript
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
</div>
</details>

<details>
<summary>Review</summary>   
<div markdown="1">  
 
```typescript
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
  },
  image: [{ type: String }],
  reason: [{ type: String }],
});
```
</div>
</details>

<details>
<summary>Prescription(외식대처법)</summary>   
<div markdown="1">  
 
```typescript
const PrescriptionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  content: {
    type: String,
    required: true,
  },
});
```
</div>
</details>

<details>
<summary>Category</summary>   
<div markdown="1">  
 
```typescript
const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  prescriptions: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Prescription",
    },
  ],
});
```
</div>
</details>

<br/>

### 💻 Roles
|기능명|엔드포인트|담당|구현 진척도|
| :---: | :---: | :---: | :---: |
|소셜 로그인|[POST] /auth|`김소현`|✅|
|토큰 재발급|[GET] /auth/token|`김소현`|✅|
|메인 지도 뷰|[GET] /restaurant?longtitude={위도}&latitude={위도}&zoom={반경범위}|`이현우`|✅|
|식당 검색|[GET] /restaurant?query={검색어}|`이현우`|✅|
|식당 간략 정보|[GET] /restaurant/:restaurantId|`김소현`|✅|
|메뉴 상세 정보|[GET] /restaurant/:restaurantId/menus|`김소현`|✅|
|외식 대처법|[GET] /restaurant/:restaurantId/dealing|`김소현`|✅|
|헬푸미 리뷰|[GET] /restaurant/:restaurantId/reviews|`이현우`|✅|
|블로그 리뷰|[GET] /restaurant/:restaurantId/reviews/blog|`이현우`|✅|
|리뷰 작성|[POST] /user/:userId/:restaurantId/review|`김소현`|✅|
|리뷰 삭제|[DELETE] /user/:reviewId|`이현우`|✅|
|리뷰 수정|[PUT] /user/:userId/:restaurantId/review|`김소현`|✅|
|리뷰 모아보기|[GET] /user/:userId/reviews|`이현우`|✅|
|식당 스크랩 업데이트|[PUT] /user/:userId/scrap/:restaurantId|`김소현`|✅|
|식당 스크랩 모아보기|[GET] /user/:userId/scraps|`김소현`|✅|
|유저 프로필 보기|[GET] /user/:userId/profile|`김소현`|✅|
|유저 프로필 변경|[PUT] /user/:userId/profile|`김소현`|✅|
|회원탈퇴|[DELETE] /user/:userId/withdrawal|`김소현`|✅|

<br/>

### 📝 API Specification
[최종 API 명세서](https://github.com/Health-Food-Me/Health-Food-Me-Server/wiki/API-명세서)

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

<br/>

<details>
<summary> <h3> 🔶 package.json (dependencies module)</h3></summary>   
<div markdown="1">   

```
{
    "name": "dist",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "dev": "nodemon",
        "build": "tsc",
        "reset": "rm -rf node_modules && rm -rf dist && yarn install",
        "lint": "./node_modules/.bin/eslint .",
        "test": "cross-env NODE_ENV=test jest --setupFiles dotenv/config --config jest.config.js --detectOpenHandles --forceExit",
        "lint-staged": "lint-staged",
        "prepare": "husky install"
    },
    "author": "thguss <thgus345@naver.com>",
    "contributors": [
        "l2hyunwoo <l2hyunwoo@gmail.com>"
    ],
    "license": "ISC",
    "devDependencies": {
        "@types/bcryptjs": "^2.4.2",
        "@types/dotenv": "^8.2.0",
        "@types/express": "^4.17.13",
        "@types/jest": "^28.1.4",
        "@types/jsonwebtoken": "^8.5.8",
        "@types/mongoose": "^5.11.97",
        "@types/morgan": "^1.9.3",
        "@types/multer": "^1.4.7",
        "@types/multer-s3": "^2.7.12",
        "@types/node": "^18.0.5",
        "@types/supertest": "^2.0.12",
        "@types/swagger-ui-express": "^4.1.3",
        "@typescript-eslint/eslint-plugin": "^5.30.5",
        "@typescript-eslint/parser": "^5.30.5",
        "cross-env": "^7.0.3",
        "eslint": "^8.19.0",
        "eslint-config-prettier": "^8.5.0",
        "eslint-plugin-prettier": "^4.2.1",
        "husky": "^8.0.0",
        "jest": "^28.1.2",
        "lint-staged": "^13.0.3",
        "n": "^9.0.0",
        "nodemon": "^2.0.18",
        "prettier": "^2.7.1",
        "supertest": "^6.2.4",
        "ts-jest": "^28.0.5",
        "ts-node": "^10.7.0",
        "typescript": "^4.6.3"
    },
    "dependencies": {
        "@sentry/node": "^7.7.0",
        "@sentry/tracing": "^7.7.0",
        "@types/multer": "^1.4.7",
        "@types/nunjucks": "^3.2.1",
        "@types/winston": "^2.4.4",
        "aws-sdk": "^2.1140.0",
        "axios": "^0.27.2",
        "bcryptjs": "^2.4.3",
        "dotenv": "^16.0.0",
        "express": "^4.17.3",
        "express-validator": "^6.14.0",
        "http-status-codes": "^2.2.0",
        "jsonwebtoken": "^8.5.1",
        "module-alias": "^2.2.2",
        "mongoose": "^6.3.1",
        "morgan": "^1.10.0",
        "multer": "^1.4.4",
        "multer-s3": "^2.10.0",
        "nunjucks": "^3.2.3",
        "swagger-cli": "^4.0.4",
        "swagger-ui-express": "^4.5.0",
        "winston": "^3.8.1"
    },
    "lint-staged": {
        "*.ts": [
            "eslint --fix"
        ]
    },
    "repository": "https://github.com/Health-Food-Me/Health-Food-Me-Server.git"
}
```
</div>
</details>

<br/>

### 📌 Server Architecture
- 개발 환경 : Typescript, Express(Node.js)
- 데이터베이스 : MongoDB, AWS S3
- 서버 환경 : AWS EC2, PM2

<img src="https://user-images.githubusercontent.com/55437339/180410559-71ba8ab6-d671-40a8-8e5b-c8eb07ea2884.png" style="width:600px;"/>

