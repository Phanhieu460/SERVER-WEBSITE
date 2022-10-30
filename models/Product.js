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
        type: String
    },
    salePrice: {
        type: String
    },
    entryPrice: {
        type: String
    },
    quantity: {
        type: Number
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'admins'
    }
})

ProductSchema.set('timestamps', true)

module.exports = mongoose.model('products', ProductSchema)