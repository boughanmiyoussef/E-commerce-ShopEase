const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @router GET /api/admin/products
// @desc Get all products (admin only)
// @access private admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("Products from DB:", products); // Log products
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
