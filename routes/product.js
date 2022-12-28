const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Product = require("../models/Product");
// @route GET api/product
// GET post
// @access Private
router.get("/", async (req, res) => {
  try {
    // const products = await Product.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    // const products = await Product.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const products = await Product.find({ type: req.query.type });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/product/:id
// GET post
// @access Private
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // const products = await Product.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const products = await Product.findOne({ id: req.params.id });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/product
// Create post
// @access Private

router.post("/", verifyToken, async (req, res) => {
  const {
    name,
    salePrice,
    entryPrice,
    discount,
    latestProduct,
    category,
    tag,
    variation,
    stock,
    image,
    shortDescription,
    fullDescription,
  } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  try {
    const newProduct = new Product({
      name,
      salePrice: salePrice || 0,
      entryPrice: entryPrice || 0,
      discount: discount || 0,
      latestProduct: latestProduct || false,
      category,
      tag,
      variation,
      stock: stock || 0,
      image,
      shortDescription: shortDescription || "",
      fullDescription: fullDescription || "",
    });
    await newProduct.save();
    res.json({
      success: true,
      message: "Created Product Successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const {
    name,
    salePrice,
    entryPrice,
    discount,
    latestProduct,
    category,
    tag,
    variation,
    stock,
    image,
    shortDescription,
    fullDescription,
  } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  try {
    let updateProduct = {
      name,
      salePrice: salePrice || 0,
      entryPrice: entryPrice || 0,
      shortDescription: shortDescription || "",
      fullDescription: fullDescription || "",
      image,
      discount: discount || 0,
      latestProduct: latestProduct || false,
      category,
      tag,
      variation,
      stock: stock || 0,
    };

    const productUpdateCondition = { _id: req.params.id, user: req.userId };

    updatePost = await Product.findOneAndUpdate(
      productUpdateCondition,
      updateProduct,
      {
        new: true,
      }
    );

    // USer not authorised to update product
    if (!updateProduct) {
      return res.status(401).json({
        success: false,
        message: "Product not found or user authorised",
      });
    }

    res.json({
      success: true,
      message: "Excellent progress!",
      product: updateProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/products
// @desc Delete product
// @access Private
router.delete("/:id", async (req, res) => {
  try {
    const productDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedProduct = await Product.findOneAndDelete(
      productDeleteCondition
    );

    // User not authorised or post not found
    if (!deletedProduct)
      return res.status(401).json({
        success: false,
        message: "Product not found or user not authorised",
      });

    res.json({ success: true, product: deletedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
