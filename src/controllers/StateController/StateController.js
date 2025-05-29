const StateSchema = require("../../models/adminModel/StateSchema");

exports.createState = async (req, res) => {
  try {
    const state = await StateSchema.create(req.body);
    res.status(201).json({ success: true, data: state });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getStates = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    let query = {};
    if (search) {
      query = {
        name: { $regex: search, $options: 'i' },
      };
    }

    let statesQuery = StateSchema.find(query);

    if (page && limit) {
      statesQuery = statesQuery
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));
    }

    const states = await statesQuery.exec();
    const total = await StateSchema.countDocuments(query);

    const response = {
      success: true,
      data: states,
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
    res.status(400).json({ success: false, message: "Error fetching states", error: error.message });
  }
};

exports.updateState = async (req, res) => {
  try {
    const state = await StateSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!state) {
      return res.status(404).json({ success: false, message: "State not found" });
    }
    res.status(200).json({ success: true, data: state });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteState = async (req, res) => {
  try {
    const state = await StateSchema.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).json({ success: false, message: "State not found" });
    }
    res.status(200).json({ success: true, message: "State deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};






  