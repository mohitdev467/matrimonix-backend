const DeleteRequestSchema = require("../../models/adminModel/DeleteRequestSchema");

exports.createDeleteRequest = async (req, res) => {
  try {
    const newRequest = new DeleteRequestSchema(req.body);
    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllDeleteRequests = async (req, res) => {
  try {
    const requests = await DeleteRequestSchema.find();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
exports.getDeleteRequestById = async (req, res) => {
  try {
    const request = await DeleteRequestSchema.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: "User Not found" });
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateDeleteRequest = async (req, res) => {
  try {
    const request = await DeleteRequestSchema.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (req.body.status) {
      req.body.requestStatus = req.body.status;
      delete req.body.status;
    }

    Object.assign(request, req.body);

    await request.save();

    res.status(200).json({
      success: true,
      message: "Delete request updated successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Delete
exports.deleteRequest = async (req, res) => {
  try {
    const deleted = await DeleteRequestSchema.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "User Not found" });
    res.status(200).json({ success: true, message: "Deleted request successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

