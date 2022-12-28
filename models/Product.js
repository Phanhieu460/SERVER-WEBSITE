const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    requried: true,
  },
  salePrice: {
    type: String,
  },
  entryPrice: {
    type: String,
  },
  discount: {
    type: Number,
  },
  latestProduct: {
    type: Boolean,
    enum: [true, false],
  },
  category: {
    type: Array,
  },
  tag: {
    type: Array,
  },
  variation: {
    type: Array,
  },
  stock: {
    type: Number,
  },
  image: {
    type: Array,
  },
  shortDescription: {
    type: String,
  },
  fullDescription: {
    type: String,
  },
});

ProductSchema.set("timestamps", true);

module.exports = mongoose.model("products", ProductSchema);
