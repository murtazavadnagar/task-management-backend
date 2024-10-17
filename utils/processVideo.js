const { exec } = require("child_process");

const processVideo = (req, res) => {
  const videoPath = req.body.videoPath;

  exec(`ffmpeg -i ${videoPath} output.mp4`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error processing video: ${error.message}`);
      return res.status(500).json({ error: "Video processing failed" });
    }

    res.status(200).json({ message: "Video processed successfully!" });
  });
};

app.post("/process-video", processVideo);
