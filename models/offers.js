const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, required: [true, "Amount is required"], min: 0.01},
    status: {type: String, enum: ["pending", "rejected", "accepted"], default: "pending"},
    offerer: {type: Schema.Types.ObjectId, ref: "User", required: [true, "Offerer is required"]},
    egg: {type: Schema.Types.ObjectId, ref: "Egg", required: [true, "Egg is required"]}
});

module.exports = mongoose.model("Offer", offerSchema);
