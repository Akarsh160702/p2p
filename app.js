const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: path.join(__dirname, "uploads") });

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const fileName = file.originalname;
  const filePath = path.join(__dirname, "uploads", fileName);

  // Move uploaded file to a permanent location
  fs.rename(file.path, filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error uploading file." });
    } else {
      res.send({ message: "File uploaded successfully." });
    }
  });
});

// List available files
app.get("/files", (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, "uploads"));
  const fileList = files.map((file) => ({ name: file }));
  res.json(fileList);
});

// Download file
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.status(404).send({ message: "File not found." });
    return;
  }

  // Set appropriate headers for download
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/octet-stream");

  // Stream the file to the client
  fs.createReadStream(filePath).pipe(res);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
