const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    name: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    phone: {
        type: String,
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    numberOfPurchase: {
        type: Number
    },
    customerType: {
        type: String,
        enum: ['VIP', 'Member']
    }
})

module.exports = mongoose.model('customers', CustomerSchema)