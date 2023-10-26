const mongoose = require("mongoose");

const user = require("./userSchema");
const card = require("./cardSchema");

const dataSchema = new mongoose.Schema({
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: card,
    },
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
    },
})


module.exports = mongoose.model("Data", dataSchema);