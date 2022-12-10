
const mongoose = require("mongoose");

const grnLineItemsSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    stockPrice:{
        type:Number,
        required:true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})


module.exports = mongoose.model("GrnListItem",grnLineItemsSchema);