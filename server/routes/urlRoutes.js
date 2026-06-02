const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createShortUrl,
  getAnalytics,
  getMyUrls,
  deleteUrl,
  updateUrl,
} = require("../controllers/urlController");

router.post("/shorten", auth, createShortUrl);

router.get("/analytics/:shortId", auth, getAnalytics);

router.get("/myurls", auth, getMyUrls);

router.delete("/:shortId", auth, deleteUrl);

router.put("/:shortId", auth, updateUrl);

module.exports = router;