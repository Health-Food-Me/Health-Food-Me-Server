"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";
exports.default = {
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT, 10),
    /**
     * MongoDB URI
     */
    mongoURI: process.env.MONGODB_URI,
    /**
     * AWS S3
     */
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3SecretKey: process.env.S3_SECRET_KEY,
    bucketName: process.env.BUCKET_NAME,
    /**
     * JWT
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgo: process.env.JWT_ALGORITHM,
    /**
     * Naver
     */
    naverClientId: process.env.NAVER_CLIENT_ID,
    naverClientSecret: process.env.NAVER_CLIENT_SECRET,
};
//# sourceMappingURL=index.js.map