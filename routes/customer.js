const express = require("express");
const asyncHandler = require("express-async-handler");
const { admin, protect } = require("../middleware/auth");
const router = express.Router();

const Customer = require("../models/Customer");

//GET ALL Customer
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Customer.countDocuments({ ...keyword });
    const customers = await Customer.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    res.json({ customers, page, pages: Math.ceil(count / pageSize) });
  })
);

// ADMIN GET ALL Customer WITHOUT SEARCH AND PEGINATION
router.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const customers = await Customer.find({}).sort({ _id: -1 });
    res.json(customers);
  })
);

// GET SINGLE Customer
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404);
      throw new Error("Customer not Found");
    }
  })
);
// DELETE CUSTOMER
router.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      await customer.remove();
      res.json({ message: "Xóa Thành Công" });
    } else {
      res.status(404);
      throw new Error("Customer not Found");
    }
  })
);

// CREATE Customer
router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const {
      name,
      gender,
      phone,
      email,
      address,
      numberOfPurchase,
      customerType,
    } = req.body;
    const customerExist = await Customer.findOne({ name });
    if (customerExist) {
      res.status(400);
      throw new Error("Blog name already exist");
    } else {
      const customer = new Customer({
        name,
        gender,
        phone,
        email,
        address,
        numberOfPurchase,
        customerType,
        user: req.user._id,
      });
      if (customer) {
        const createdcustomer = await customer.save();
        res.status(201).json(createdcustomer);
      } else {
        res.status(400);
        throw new Error("Invalid customer data");
      }
    }
  })
);

// UPDATE CUSTOMER
router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const {
      name,
      gender,
      phone,
      email,
      address,
      numberOfPurchase,
      customerType,
    } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.name = name || customer.name;
      customer.gender = gender || customer.gender;
      customer.phone = phone || customer.phone;
      customer.email = email || customer.email;
      customer.address = address || customer.address;
      customer.numberOfPurchase = numberOfPurchase || customer.numberOfPurchase;
      customer.customerType = customerType || customer.customerType;

      const updatedCustomer = await customer.save();
      res.json(updatedCustomer);
    } else {
      res.status(404);
      throw new Error("Customer not found");
    }
  })
);
module.exports = router;
