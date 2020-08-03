const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    ranked: {
        type: String,
        required: false
    },
    wins: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    },
    lol_id: {
        type: String,
        required: true
    }
})

const User = mongoose.model("users",userSchema)

module.exports = User