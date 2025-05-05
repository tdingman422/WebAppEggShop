const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eggSchema = new Schema({
    title: {type: String, required: [true, "Title is required."]},
    image: {type: String, required: [true, "Image is required."]},
    condition: {type: String, required: [true, "Condition is required."], enum: ["Good", "Great", "New", "Bad", "Other"]},
    price: {type: Number, required: [true, "Price is required."], min: 0.01},
    totalOffers: {type: Number, default: 0},
    highestOffer: {type: Number, default: 0},
    seller: {type: Schema.Types.ObjectId, ref: "User", required: [true, "Seller is required."]},
    details: {type: String, required: [true, "Details are required."]},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model("Egg", eggSchema);
