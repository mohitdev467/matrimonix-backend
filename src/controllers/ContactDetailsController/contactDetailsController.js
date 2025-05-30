const ContactDetailsSchema = require("../../models/adminModel/ContactDetailsSchema");

module.exports.addContactDetails = async (req, res) => {
  try {
    const existing = await ContactDetailsSchema.findOne();
    const payload = {
      location: req.body.location || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      socialLinks: {
        facebook: req.body.socialLinks?.facebook || "",
        twitter: req.body.socialLinks?.twitter || "",
        instagram: req.body.socialLinks?.instagram || "",
        linkedin: req.body.socialLinks?.linkedin || "",
      },
    };

    let contact;
    if (existing) {
      contact = await ContactDetailsSchema.findByIdAndUpdate(
        existing._id,
        payload,
        {
          new: true,
        }   
      );
    } else {
      contact = await ContactDetailsSchema.create(payload);
    }

    res
      .status(200)
      .json({
        data: contact,
        success: true,
        message: "Contact details saved successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to save contact details",
        message: error.message,
        success: false,
      });
  }
};
module.exports.getContactDetails = async (req, res) => {
  try {
    const contact = await ContactDetailsSchema.findOne(); // only one document
    res
      .status(200)
      .json({
        data: contact || {},
        success: true,
        message: "Contact details fetched successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch contact details",
        message: error.message,
        success: false,
      });
  }
};
