const { nanoid } = require("nanoid");
const Url = require("../models/Url");


// CREATE SHORT URL
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    const shortId = nanoid(7);

    const newUrl = await Url.create({
      originalUrl,
      shortId,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      shortUrl: `http://localhost:5000/${shortId}`,
      data: newUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// GET ANALYTICS OF A PARTICULAR URL
const getAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    res.status(200).json({
  success: true,
  originalUrl: url.originalUrl,
  shortId: url.shortId,
  clicks: url.clicks,
  createdAt: url.createdAt,
  visits: url.visits,
});
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// GET ALL URLS CREATED BY LOGGED-IN USER
const getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: urls.length,
      urls,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deleteUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOneAndDelete({
      shortId,
      userId: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { originalUrl } = req.body;

    const url = await Url.findOne({
      shortId,
      userId: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    url.originalUrl = originalUrl;
    await url.save();

    res.status(200).json({
      success: true,
      message: "URL updated successfully",
      url,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createShortUrl,
  getAnalytics,
  getMyUrls,
deleteUrl,
updateUrl,
};