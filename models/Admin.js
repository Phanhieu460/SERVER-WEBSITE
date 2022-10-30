const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
    },
    address: {
        type: String
    },
    phone: {
        type: String,
        unique: true
    },
    gender: {
        type: String,
    },
    image: {
        type: String
    }
})
AdminSchema.set('timestamps', true)

module.exports = mongoose.model('admins', AdminSchema) //users: ten collection trong DB