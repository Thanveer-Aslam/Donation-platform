import dotenv from "dotenv";
dotenv.config();

import { S3Client } from "@aws-sdk/client-s3";

console.log("ACCESS KEY LENGTH:", process.env.AWS_ACCESS_KEY_ID?.length);
console.log("SECRET KEY LENGTH:", process.env.AWS_SECRET_ACCESS_KEY?.length);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3;
