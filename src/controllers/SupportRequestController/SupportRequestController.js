const SupportRequestSchema = require("../../models/adminModel/SupportRequestSchema");

exports.createSupportRequest = async (req, res) => {
  try {
    const newRequest = new SupportRequestSchema(req.body);
    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequestSchema.find();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
exports.getSupportRequestById = async (req, res) => {
  try {
    const request = await SupportRequestSchema.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateSupportRequest = async (req, res) => {
    try {
      const request = await SupportRequestSchema.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ success: false, error: "Not found" });
      }
  
      if (req.body.status === "toggle") {
        const nextStatus = {
          pending: "approved",
          approved: "rejected",
          rejected: "pending",
        };
  
        request.status = nextStatus[request.status] || "pending";
      } else {
        Object.assign(request, req.body); 
      }
  
      await request.save();
  
      res.status(200).json({
        success: true,
        message: "Support request updated successfully",
        data: request,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  };


// Delete
exports.deleteSupportRequest = async (req, res) => {
  try {
    const deleted = await SupportRequestSchema.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Toggle Status (pending -> approved -> rejected -> pending)
exports.toggleSupportRequestStatus = async (req, res) => {
  try {
    const request = await SupportRequestSchema.findById(req.params.status);
    if (!request) return res.status(404).json({ success: false, error: "Not found" });

    const nextStatus = {
      pending: "approved",
      approved: "rejected",
      rejected: "pending",
    };

    request.status = nextStatus[request.status];
    await request.save();

    res.status(200).json({
      success: true,
      message: `Status changed to ${request.status}`,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
