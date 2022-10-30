const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Admin = require("../models/Admin");

//@route POST api/admin/register
//@access Public
router.post('/register', async (req, res) => {
	const { username, password, fullName, phone, gender, address, image } = req.body
    

	// Simple validation
	if (!username || !password) {

		return res
			.status(400)
			.json({ success: false, message: 'Missing username and/or password' })
    }

	try {
		// Check for existing user
		const user = await Admin.findOne({ username })

		if (user) {
			return res
				.status(400)
				.json({ success: false, message: 'Username already taken' })
        }

		// All good
		const hashedPassword = await argon2.hash(password)
		const newUser = new Admin({ username, password: hashedPassword, fullName, gender, phone, image, address })
		await newUser.save()

		// Return token
		const accessToken = jwt.sign(
			{ userId: newUser._id },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User created successfully',
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
//@route POST api/admin/login
//@access Public

router.post("/login", async(req, res) => {
    const {username, password} = req.body

    if(!username || !password) {
        return res.status(400).json({success: false, message: "Missing username or password"})
    }
    try {
        const user = await Admin.findOne({username})

        if(!user) {
            return res.status(400).json({success: false, message: "Incorrect username or password"})
        }

        const passwordValid = await argon2.verify(user.password, password)

        if (!passwordValid) {
            return res.status(400).json({success: false, message: "Incorrect password"})
        }

        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)

        res.json({success: true, message: 'User logged in sucessfully', accessToken})
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

module.exports = router;
