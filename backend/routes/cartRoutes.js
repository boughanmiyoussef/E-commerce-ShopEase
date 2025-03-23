const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged-in user
// @access Public (with optional token)
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, userId, guestId } = req.body;
  try {
    if (!productId && !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          countInStock: product.countInStock,
          size: size || "N/A",
          color: color || "N/A",
          quantity
        });
      }
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    } else {
      cart = await Cart.create({
        user: userId || null,
        guestId: guestId || null,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size: size || "N/A",
            color: color || "N/A",
            quantity
          }
        ],
        totalPrice: product.price * quantity
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/cart/:productId
// @desc Update product quantity in the cart
// @access Public (with optional token)
router.put("/:productId", async (req, res) => {
  const { productId, quantity, size, color, userId, guestId } = req.body;

  try {
    // Validate required fields
    if (!productId || typeof quantity !== "number" || !size || !color) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    console.log("Received userId:", userId);
    console.log("Received guestId:", guestId);

    let cart = await getCart(userId, guestId);
    console.log("Fetched cart:", cart); // Debug: Log fetched cart

    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product Not Found In Cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error.message);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later."
    });
  }
});

// @route Delete /api/cart

// @desc remove a product from the cart

// @access Public
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();

      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/cart
// @desc Get logged-in user's or guest user's cart
// @access public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // Validate guestId
    if (!guestId) {
      return res.status(400).json({ message: "Guest ID is required" });
    }

    // Fetch guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      // Handle empty guest cart
      if (guestCart.products.length === 0) {
        if (userCart) {
          return res.status(200).json(userCart);
        }
        return res.status(200).json({
          message: "Guest cart is empty, returning user cart",
          cart: null
        });
      }

      // Merge guest cart into user cart if user cart exists
      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });

        // Recalculate total price
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await userCart.save();

        // Delete guest cart
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart:", error.message);
        }

        return res.status(200).json(userCart);
      }

      // Convert guest cart to user cart if no user cart exists
      guestCart.user = req.user._id;
      guestCart.guestId = undefined;
      await guestCart.save();
      return res.status(200).json(guestCart);
    }

    // Return user cart if no guest cart exists
    if (userCart) {
      return res.status(200).json(userCart);
    }

    // No guest cart or user cart found
    return res.status(404).json({ message: "Guest Cart Not Found" });
  } catch (error) {
    console.error("Error merging carts:", error.message);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later."
    });
  }
});

module.exports = router;
