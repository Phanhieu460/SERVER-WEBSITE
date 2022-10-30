const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Blog = require("../models/Blog");
// @route GET api/Blog
// GET post
// @access Private
router.get("/", async (req, res) => {
  try {
    // const Blogs = await Blog.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const blogs = await Blog.find({})
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    // const Blogs = await Blog.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const blogs = await Blog.find({type: req.query.type})
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/Blog/:id
// GET post
// @access Private
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // const Blogs = await Blog.find({ adminId: req.userId }).populate(
    //   "adminId",
    //   ["username"]
    // );
    const blogs = await Blog.findOne({id: req.params.id})
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/Blog
// Create post
// @access Private

router.post("/", verifyToken, async (req, res) => {
  const { name,  description, image, writer } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  try {
    const newBlog = new Blog({
      name,
      description,
      image,
      writer
    });
    await newBlog.save();
    res.json({
      success: true,
      message: "Created Blog Successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { name, description, image, writer } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  try {
    let updateBlog = {
      name,
      description: description || "",
      image,
      writer
    };

    const blogUpdateCondition = { _id: req.params.id, user: req.userId };

    updatePost = await Blog.findOneAndUpdate(blogUpdateCondition, updateBlog, {
      new: true,
    });

    // USer not authorised to update Blog
    if (!updateBlog) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Blog not found or user authorised",
        });
    }

    res.json({
      success: true,
      message: "Excellent progress!",
      Blog: updateBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/Blogs
// @desc Delete Blog
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		const blogDeleteCondition = { _id: req.params.id, user: req.userId }
		const deletedBlog = await Blog.findOneAndDelete(blogDeleteCondition)

		// User not authorised or post not found
		if (!deletedBlog)
			return res.status(401).json({
				success: false,
				message: 'Blog not found or user not authorised'
			})

		res.json({ success: true, blog: deletedBlog })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
module.exports = router;
