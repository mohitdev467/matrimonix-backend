const Testimonials = require("../../models/adminModel/Testimonials");

// CREATE
const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonials.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// READ ALL WITH PAGINATION AND SEARCH
const getAllTestimonials = async (req, res) => {
  try {
    const { search = '', page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(pageSize);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = search
      ? {
          $or: [
            { groomName: { $regex: search.trim(), $options: 'i' } },
            { brideName: { $regex: search.trim(), $options: 'i' } },
            { description: { $regex: search.trim(), $options: 'i' } },
          ],
        }
      : {};

    const totalCount = await Testimonials.countDocuments(filter);

    const testimonials = await Testimonials.find(filter)
      .limit(limitNumber)
      .skip(skip)
      .sort({ createdAt: -1 });

    

    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal Server Error', details: err.message });
  }
};

// GET ONE
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonials.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: testimonial });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE
const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonials.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE
const deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonials.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
