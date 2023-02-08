const express = require("express");
const asyncHandler = require("express-async-handler");
const { admin, protect } = require("../middleware/auth");
const router = express.Router();

const Product = require("../models/Product");

//GET ALL Product
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 24;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword });
    // .limit(pageSize)
    // .skip(pageSize * (page - 1))
    // .sort({ _id: -1 });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PEGINATION
router.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  })
);

// GET SINGLE PRODUCT
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);
// DELETE PRODUCT
router.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Sản phẩm đã được xóa" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// CREATE PRODUCT
router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
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
    const productExist = await Product.findOne({ name });
    if (productExist) {
      res.status(400);
      throw new Error("Product name already exist");
    } else {
      const product = new Product({
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
        user: req.user._id,
      });
      if (product) {
        const createdproduct = await product.save();
        res.status(201).json(createdproduct);
      } else {
        res.status(400);
        throw new Error("Invalid product data");
      }
    }
  })
);

// UPDATE PRODUCT
router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
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
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.salePrice = salePrice || product.salePrice;
      product.entryPrice = entryPrice || product.entryPrice;
      product.discount = discount || product.discount;
      product.latestProduct = latestProduct || product.latestProduct;
      product.category = category || product.category;
      product.tag = tag || product.tag;
      product.shortDescription = shortDescription || product.shortDescription;
      product.fullDescription = fullDescription || product.fullDescription;
      product.image = image || product.image;
      product.stock = stock || product.stock;
      product.variation = variation || product.variation;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);
module.exports = router;
