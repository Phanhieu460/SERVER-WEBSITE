const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Customer = require("../models/Customer");
// @route GET api/Customer
// GET post
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    // const customers = await Customer.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const customers = await Customer.find({});
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/Customer/:id
// GET post
// @access Private
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // const Customers = await Customer.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const customers = await Customer.findOne({ id: req.params.id });
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/Customer
// Create post
// @access Private

router.post("/", verifyToken, async (req, res) => {
  const {
    name,
    gender,
    phone,
    address,
    email,
    numberOfPurchase,
    customerType,
  } = req.body;

  try {
    const newCustomer = new Customer({
      name,
      gender,
      phone,
      address,
      email,
      numberOfPurchase,
      customerType,
    });
    await newCustomer.save();
    res.json({
      success: true,
      message: "Created Customer Successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const {
    name,
    gender,
    phone,
    address,
    email,
    numberOfPurchase,
    customerType,
  } = req.body;

  try {
    let updateCustomer = {
      name,
      name,
      gender,
      phone,
      address,
      email,
      numberOfPurchase: numberOfPurchase || 0,
      customerType: customerType || "Member",
    };

    const customerUpdateCondition = { _id: req.params.id, user: req.userId };

    updateCustomer = await Customer.findOneAndUpdate(
      customerUpdateCondition,
      updateCustomer,
      {
        new: true,
      }
    );

    // USer not authorised to update Customer
    if (!updateCustomer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found or user authorised",
      });
    }

    res.json({
      success: true,
      message: "Excellent progress!",
      customer: updateCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/Customers
// @desc Delete Customer
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const customerDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedCustomer = await Customer.findOneAndDelete(
      customerDeleteCondition
    );

    // User not authorised or post not found
    if (!deletedCustomer)
      return res.status(401).json({
        success: false,
        message: "Customer not found or user not authorised",
      });

    res.json({ success: true, customer: deletedCustomer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
