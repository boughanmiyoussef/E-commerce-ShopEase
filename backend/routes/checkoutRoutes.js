const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Paid",
      isPaid: true,
    });

    

    console.log(`Checkout Created For User: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating Checkout Session:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/checkout
// @desc Get all checkout sessions for the authenticated user
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.status(200).json(checkouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails, totalPrice } = req.body;

  console.log("Updating payment for checkout:", req.params.id);
  console.log("Payment status:", paymentStatus);
  console.log("Payment details:", paymentDetails);
  console.log("Total price:", totalPrice);

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      console.error("Checkout not found:", req.params.id);
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Validate required fields
    if (!totalPrice || !paymentStatus) {
      console.error("Missing required fields:", { totalPrice, paymentStatus });
      return res.status(400).json({ message: "Total price and payment status are required" });
    }

    // Update payment status (case-insensitive)
    if (paymentStatus.toLowerCase() === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = "Paid"; // Set to "Paid" (uppercase)
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      checkout.totalPrice = totalPrice;
      await checkout.save();

      console.log("Payment updated successfully:", checkout);
      res.status(200).json(checkout);
    } else {
      console.error("Invalid payment status:", paymentStatus);
      res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
    try {
      const checkout = await Checkout.findById(req.params.id);
      if (checkout.isPaid && !checkout.isFinalized) {
        // Create a final order based on the checkout details
        const finalOrder = await Order.create({
          user: checkout.user,
          orderItems: checkout.checkoutItems,
          shippingAddress: checkout.shippingAddress,
          paymentMethod: checkout.paymentMethod,
          totalPrice: checkout.totalPrice,
          isPaid: true,
          paidAt: checkout.paidAt,
          isDelivered: false,
          paymentStatus: checkout.paymentStatus,
          paymentDetails: checkout.paymentDetails || {},
        });
  
        // Mark the checkout as finalized
        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();
  
        // Delete the associated cart
        await Cart.findOneAndDelete({ user: checkout.user });
  
        res.status(201).json(finalOrder);
      } else if (checkout.isFinalized) {
        return res.status(400).json({ message: "Checkout already finalized" });
      } else {
        return res.status(400).json({ message: "Checkout is not paid" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
module.exports = router;
