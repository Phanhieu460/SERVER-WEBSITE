const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Product = require("../models/Product");
// @route GET api/product
// GET post
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ adminId: req.userId }).populate(
      "adminId",
      ["username"]
    );

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/product
// Create post
// @access Private

router.post("/", verifyToken, async (req, res) => {
  const { name, type, description, image, salePrice, entryPrice } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  try {
    const newProduct = new Product({
      name,
      type,
      description,
      image,
      salePrice,
      entryPrice,
      adminId: req.userId,
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
  const { name, type, description, image, salePrice, entryPrice } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  try {
    let updateProduct = {
      name,
      type,
      description: description || "",
      image,
      salePrice: salePrice || 0,
      entryPrice: entryPrice || 0,
      adminId: req.userId,
    };

    const productUpdateCondition = { _id: req.params.id, user: req.userId };

    updatePost = await Product.findOneAndUpdate(productUpdateCondition, updateProduct, {
      new: true,
    });

    // USer not authorised to update product
    if (!updateProduct) {
      return res
        .status(401)
        .json({
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
router.delete('/:id', verifyToken, async (req, res) => {
	try {
		const productDeleteCondition = { _id: req.params.id, user: req.userId }
		const deletedProduct = await Product.findOneAndDelete(productDeleteCondition)

		// User not authorised or post not found
		if (!deletedProduct)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({ success: true, product: deletedProduct })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
module.exports = router;
