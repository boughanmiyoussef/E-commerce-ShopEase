const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();
// @route POST /api/admin/products
// @desc Create a new product (admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      weight,
      dimensions,
      sku
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      images,
      isFeatured,
      isPublished,
      weight,
      sku,
      tags,
      dimensions,
      user: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});
// @route PUT /api/products/:id
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      weight,
      dimensions,
      sku
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});
// @route DELETE /api/products/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product Removed" });
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/products/:id/stock
// @desc    Update product stock after an order, delete if stock reaches 0
// @access  Private/Admin
router.put("/:id/stock", protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Stock before deduction:", product.countInStock);

    // Validate requested quantity
    if (quantity > product.countInStock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Deduct stock
    product.countInStock -= quantity;

    // Check if stock is negative (should never happen)
    if (product.countInStock < 0) {
      console.error("Stock went negative. Rolling back...");
      return res.status(500).json({ message: "Internal server error: Stock went negative" });
    }

    // Delete product if stock reaches 0
    if (product.countInStock === 0) {
      console.log("Deleting product due to zero stock:", product._id);
      await product.deleteOne();
      return res.json({
        message: "Product stock depleted and deleted",
        product
      });
    }

    // Save updated product if stock > 0
    await product.save();
    console.log("Product saved successfully:", product);

    // Return success response
    res.json({ message: "Stock updated successfully", product });
  } catch (error) {
    console.error("Error in stock update:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/orders", protect, async (req, res) => {
  try {
    const { products } = req.body;

    // Validate and deduct stock for each product
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }
      if (product.countInStock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      // Deduct stock
      console.log("Stock before deduction:", product.countInStock);
      product.countInStock -= item.quantity;

      // Delete product if stock is zero
      if (product.countInStock === 0) {
        console.log("Deleting product due to zero stock:", product._id);
        await product.deleteOne();
      } else {
        await product.save();
      }
    }

    // Create the order
    const order = new Order({
      user: req.user._id,
      products,
      totalPrice: req.body.totalPrice,
      shippingAddress: req.body.shippingAddress
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// @route GET /api/products
// @desc get all products with optional query filters
// @access public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit
    } = req.query;
    // Initialize the query object
    let query = {};
    // Filter Logic
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") }; // Ensure this matches your schema
    }
    if (color) {
      query.colors = { $in: color.split(",") }; // Corrected
    }
    if (gender) {
      query.gender = gender;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    // Sort Logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }
    // Fetch products and apply sorting and limit
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
//  @route GET /api/products/best-seller
//  @desc Retrieve the product with highest rating;
//  @access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No Best Seller Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});
// @route GET /api/products/new-arrival
// @desc retrieve latest 8 products - Creation Date
// @access public
router.get("/new-arrivals", async (req, res) => {
  try {
    // Fetch 8 latest products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});
//  @route GET /api/products/:id
//  @desc Get a single product by ID
//  @access public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// @route GET /api/products/similar:/id
// @desc Retrieve similar products on the current product's gender and category
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
