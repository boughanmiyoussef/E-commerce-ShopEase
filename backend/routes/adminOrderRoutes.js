const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @router GET /api/admin/orders
// @desc Get all order (Admin Only)
// @access Private/admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Backend route to update order status
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email"); // Populate the user field

    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

      const updatedOrder = await order.save();
      res.json(updatedOrder); // Return the updated order with the populated user
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access private admin
router.delete("/:id", protect, admin, async(req, res) => {
    try{
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne();
            res.json({message: "Order Removed"})
        } else {
            res.status(404).json({message:"Order Not Found"})
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server Error"})

    }
})

module.exports = router;
