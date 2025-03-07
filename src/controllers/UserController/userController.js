const cloudinary = require("cloudinary").v2;

const uploadImageUrl = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }
    const fileBase64 = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "uploads",
    });

    return res.json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: "Image upload failed!" });
  }
};

module.exports = { uploadImageUrl };
