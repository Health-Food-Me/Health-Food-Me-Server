import config from ".";
import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "./s3Config";
import { logger } from "./winstonConfig";

// 미들웨어로 사용할 multer 생성
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: function (req: Express.Request, file: Express.MulterS3.File, cb) {
      file.originalname = `${Date.now()}_${file.originalname}`;
      cb(null, file.originalname);
    },
  }),
});

const s3Delete = async (key: string) => {
  s3.deleteObject(
    {
      Bucket: config.bucketName,
      Key: key,
    },
    (err) => {
      if (err) throw err;
      logger.e(err);
    },
  );
};

export default {
  upload,
  s3Delete,
};
