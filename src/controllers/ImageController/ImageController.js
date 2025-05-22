const uploadToCloudinary = require("../../helpers/cloudinaryHelper");
const Image = require("../../models/adminModel/Image");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);
    const newlyUploadedImage = new Image({
      url: url,
      publicId: publicId,
    });

    await newlyUploadedImage.save();

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = uploadImage;
