const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    address: {
        type: String
    },
    quantity: {
        type: String,
    },
    price: {
        type: String
    },
    adminId: {
        type: String
    },
    productID: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "customers"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
})

OrderSchema.set('timestamps', true)

module.exports = mongoose.model('orders', OrderSchema)