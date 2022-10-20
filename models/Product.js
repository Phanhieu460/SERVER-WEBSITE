const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: {
        type: String,
        requried: true
    },
    type: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: Array
    },
    salePrice: {
        type: Number
    },
    entryPrice: {
        type: Number
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'admins'
    }
})

module.exports = mongoose.model('products', ProductSchema)