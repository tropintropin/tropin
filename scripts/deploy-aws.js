import 'dotenv/config';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime";

const BUCKET = process.env.TWC_BUCKET;
const ENDPOINT = process.env.TWC_ENDPOINT;
const REGION = process.env.TWC_REGION || "ru-1";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!BUCKET || !ENDPOINT || !ACCESS_KEY || !SECRET_KEY) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const client = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

function getAllFiles(dir, prefix = "") {
  let files = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, prefix + entry + "/"));
    } else {
      files.push({ fullPath, key: prefix + entry });
    }
  }
  return files;
}

async function uploadFiles(files, concurrency = 10) {
  const uploadedKeys = new Set();
  let index = 0;
  async function worker() {
    while (index < files.length) {
      const file = files[index++];
      const body = fs.readFileSync(file.fullPath);
      const contentType = mime.getType(file.key) || "application/octet-stream";
      await client.send(new PutObjectCommand({ Bucket: BUCKET, Key: file.key, Body: body, ACL: "public-read", ContentType: contentType }));
      uploadedKeys.add(file.key);
      console.log(`Uploaded: ${file.key} (${contentType})`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return uploadedKeys;
}

async function listAllObjects(bucket) {
  let ContinuationToken;
  const allKeys = [];
  do {
    const res = await client.send(new ListObjectsV2Command({ Bucket: bucket, ContinuationToken }));
    if (res.Contents) allKeys.push(...res.Contents.map(o => o.Key));
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return allKeys;
}

async function deleteOldObjects(bucket, keepKeys) {
  const existingKeys = await listAllObjects(bucket);
  const toDelete = existingKeys.filter(k => !keepKeys.has(k));
  await Promise.all(toDelete.map(k => client.send(new DeleteObjectCommand({ Bucket: bucket, Key: k })).then(() => console.log(`Deleted: ${k}`))));
}

(async () => {
  try {
    const files = getAllFiles("./_site");
    const uploadedKeys = await uploadFiles(files, 10);
    await deleteOldObjects(BUCKET, uploadedKeys);
    console.log("Deploy finished successfully!");
  } catch (err) {
    console.error("Deploy failed:", err);
    process.exit(1);
  }
})();
