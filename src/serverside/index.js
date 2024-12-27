const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });
const genAI = new GoogleGenerativeAI("AIzaSyAAwRHDl2BodreDhIZmGGHAX4M1rrEHeKk");

app.use(cors());

app.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(__dirname, req.file.path);
    const fileData = Buffer.from(fs.readFileSync(filePath)).toString("base64");

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          data: fileData,
          mimeType: "application/pdf",
        },
      },
      "Summarize the document?",
    ]);

    res.json({ summary: result.response.text() });
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to summarize the document" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
