
const mongoose = require("mongoose");

const grnLineItemsSchema = new mongoose.Schema({
    productNmae:{
        type:String,
        required:true,
        trim:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    stckPrice:{
        type:Number,
        required:true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})


module.exports = mongoose.model("GrnListItem",grnLineItemsSchema);