const ServiceProvider = require("../../models/adminModel/ServiceProvider");

const createServiceProvider = async (req, res) => {
  try {
    const serviceProviderData = req.body;

    if (req.file) {
      serviceProviderData.image = req.file.path;
    }
    const newProvider = new ServiceProvider(serviceProviderData);
    await newProvider.save();
    res.status(201).json({
      success: true,
      message: "Service Provider added successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.status(201).json({
      success: true,
      data: providers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateServiceProvider = async (req, res) => {
  try {
    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProvider)
      return res
        .status(404)
        .json({ success: false, message: "Service provider not found" });
    res.status(201).json({
      success: true,
      message: "Service Provider updated successfully",
      data: updatedProvider,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteServiceProvider = async (req, res) => {
  try {
    const deletedProvider = await ServiceProvider.findByIdAndDelete(
      req.params.id
    );
    if (!deletedProvider)
      return res
        .status(404)
        .json({ success: false, message: "Service provider not found" });
    res.json({
      success: true,
      message: "Service Provider deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createServiceProvider,
  getServiceProviders,
  updateServiceProvider,
  deleteServiceProvider,
};
