const fs = require("fs");
const path = require("path");

const readFile = (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  const readStream = fs.createReadStream(filePath);

  readStream.pipe(res);

  readStream.on("error", (err) => {
    res.status(404).json({ error: "File not found" });
  });
};

module.exports = readFile;
