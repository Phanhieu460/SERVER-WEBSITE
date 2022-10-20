const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'admins'
    }
})

module.exports = mongoose.model('blogs', BlogSchema)