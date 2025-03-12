const NewsSchema = require("../../models/adminModel/NewsSchema");

module.exports.getNews = async (req, res) => {
  try {
    const news = await NewsSchema.find();
    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching categories", error });
  }
};

module.exports.getNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await NewsSchema.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching news", error });
  }
};

module.exports.addNews = async (req, res) => {
  try {
    const newsData = req.body;
    const news = new NewsSchema(newsData);
    await news.save();
    res.status(201).json({
      success: true,
      message: "News added successfully",
      news,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error adding news", error });
  }
};

module.exports.updateNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const newsData = req.body;
    const news = await NewsSchema.findByIdAndUpdate(newsId, newsData, {
      new: true,
    });
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }
    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: news,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error updating news", error });
  }
};

module.exports.toggleNewsStatus = async (req, res) => {
  try {
    const News = await NewsSchema.findById(req.params.id);
    if (!News)
      return res.status(404).json({ success: false, error: "News not found" });

    News.isActive = !News.isActive;
    await News.save();

    res.status(200).json({
      success: true,
      message: `News ${
        News.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

module.exports.deleteNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await NewsSchema.findByIdAndDelete(newsId);
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error deleting news", error });
  }
};
