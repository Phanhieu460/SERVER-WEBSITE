const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
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
        type: String
    },
    // address: {
    //     type: String
    // },
    // phone: {
    //     type: String,
    // },
    // gender: {
    //     type: String,
    // },
    // image: {
    //     type: String
    // }
})

module.exports = mongoose.model('users', UserSchema) //users: ten collection trong DB