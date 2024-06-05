// server.js
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const downloadDir = path.join(__dirname, "downloaded_images");
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

app.post("/download-image", async (req, res) => {
  const { url, name } = req.body;

  try {
    const response = await axios.get(url, { responseType: "stream" });
    const imagePath = path.join(downloadDir, name);

    response.data.pipe(fs.createWriteStream(imagePath));
    response.data.on("end", () =>
      res.status(200).send("Image downloaded successfully")
    );
  } catch (error) {
    res.status(500).send("Error downloading image");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
