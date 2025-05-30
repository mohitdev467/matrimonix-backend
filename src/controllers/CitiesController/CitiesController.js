const CitySchema = require("../../models/adminModel/CitySchema");

exports.createCity = async (req, res) => {
  try {
    const city = await CitySchema.create(req.body);
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    let query = {};
    if (search) {
      query = {
        name: { $regex: search, $options: 'i' },
      };
    }

    let citiesQuery = CitySchema.find(query);

    if (page && limit) {
      citiesQuery = citiesQuery
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));
    }

    const cities = await citiesQuery.exec();
    const total = await CitySchema.countDocuments(query);

    const response = {
      success: true,
      data: cities,
    };

    if (page && limit) {
      response.pagination = {
        total,
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, message: "Error fetching cities", error: error.message });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const city = await CitySchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const city = await CitySchema.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    res.status(200).json({ success: true, message: "City deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};




  
 