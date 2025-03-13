const express = require("express");
const router = express.Router();

const Subscriber = require("../models/Subscriber");
const { findOne } = require("../models/Checkout");


// @route POST /api/subscribe
// @desc handle newsletter subscription
// @access Public
router.post("/subscribe", async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({message : "Email Is Required"})
    }

    try {
        // check if the user is subscriber
        let subscriber = await Subscriber.findOne({email});

        if (subscriber) {
            return res.status(400).json({message: "Email Is Already Susbcribed"})
        }

        subscriber = new Subscriber({email});
        await subscriber.save();

        res.status(201).json({message: "Successfully Subscribed To The Newsletter"})

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"})

    }

})

module.exports = router;