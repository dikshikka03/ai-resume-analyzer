const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdf = require("pdf-parse");

const app = express();

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage()
});

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.post("/upload", upload.single("resume"), async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });

    }

    const data = await pdf(req.file.buffer);

    res.json({
      success: true,
      extractedText: data.text
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});