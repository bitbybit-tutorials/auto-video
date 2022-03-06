import fs from "fs";
import path from "path";
import os from "os";
import express from "express";
import axios from "axios";

const app = express();

app.get("/upload/tiktok", async (req, res) => {
  const TIKTOK_UPLOAD_ENDPOINT =
    "https://open-api.tiktok.com/share/video/upload";

  const url = `${TIKTOK_UPLOAD_ENDPOINT}?open_id=${openId}&access_token=${accessToken}`;
  const data = new FormData();
  data.append("video", fs.createReadStream(path.join(os.tmpdir(), "test.mp4")));
  await axios.post(url, data, {
    headers: data.getHeaders(),
  });
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3001);
