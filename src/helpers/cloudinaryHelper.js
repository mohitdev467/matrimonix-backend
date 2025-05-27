const cloudinary = require("../config/cloudinaryConfig.js");

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error in cloudinary", error);
    throw new Error("Error whole uploading file to cloudinary");
  }
};

module.exports = uploadToCloudinary;
