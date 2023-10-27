const mongoose = require('mongoose');

const Card = require('./cardSchema');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },   
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Card,
    }
},
{
    timestamps: true
});


module.exports = mongoose.model('account', accountSchema);