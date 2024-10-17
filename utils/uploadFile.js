const fs = require("fs");
const path = require("path");

const uploadFile = (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.file.fileName);
  const writeStream = fs.createWriteStream(filePath);

  req.pipe(writeStream);

  writeStream.on("finish", () => {
    writeStream.close();
    res.status(201).json({ message: "File uploaded successfully!" });
  });

  writeStream.on("error", (err) => {
    res.status(500).json({ message: "Failed to upload file" });
  });
};

module.exports = uploadFile;
