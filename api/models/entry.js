const mongoose = require("mongoose");

const entriesSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:String,
    product_id:String,
    user_name:String,
    product_name:String,
    entry_type:String,
    entry_value:String,
    taken:Number,
    consumed:Number,
    returned:Number,
    remaining:Number,
    created_at:String
})

module.exports = mongoose.model("Entries",entriesSchema);