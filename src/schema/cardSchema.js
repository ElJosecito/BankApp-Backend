const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    expiration: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("Card", cardSchema);