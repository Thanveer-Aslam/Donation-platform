import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/s3.js";
// import path from "path";

console.log("Bucket inside upload:", process.env.AWS_BUCKET_NAME);

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    // acl: "public-read",

    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },

    key: (req, file, cb) => {
      const uniqueName = `campaigns/${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

export { upload };
