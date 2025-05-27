const ServiceProvider = require("../../models/adminModel/ServiceProvider");

const createServiceProvider = async (req, res) => {
  try {
    const serviceProviderData = req.body;
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
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(pageSize);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = search
      ? {
          $or: [
            { serviceProviderName: { $regex: search.trim(), $options: "i" } },
            { category: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    const totalCount = await ServiceProvider.countDocuments(filter);

    const providers = await ServiceProvider.find(filter)
      .select(
        "serviceProviderName category about contact address pricing landmark serviceOffer image bannerImage language isActive"
      )
      .limit(limitNumber)
      .skip(skip);
    if (!providers?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Service Provider not found" });
    }
    res.status(200).json({
      success: true,
      data: providers,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", error: err });
  }
};

const getServiceProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
      return res.status(404).json({ message: "Service Provider not found" });
    }
    res.status(200).json({
      success: true,
      data: serviceProvider,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching service provider",
      error,
    });
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
  getServiceProviderById,
};
