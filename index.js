require("dotenv").config();
const express = require("express");

const cors = require("cors");

const connectDB = require("./config/MongoDb");
const authRouter = require("./routes/user");
const productRouter = require("./routes/product");
const adminRouter = require("./routes/admin");
// const customerRouter = require("./routes/customer");
// const blogRouter = require("./routes/blog");

connectDB();

const app = express();
app.use(express.json()); // doc bat cu du lieu trong body
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/admin", adminRouter);
// app.use("/customer", customerRouter);
// app.use("/blog", blogRouter);
// app.use('order', blogRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
