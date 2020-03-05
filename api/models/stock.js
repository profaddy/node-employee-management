const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    product_id:mongoose.Schema.Types.ObjectId,
    user_id:mongoose.Schema.Types.ObjectId,
    product_name:String,
    user_name:String,
    bag_value: Number
})

module.exports = mongoose.model("Stock",stockSchema);