const mongoose = require("mongoose");

const orderlineitemSchema = new mongoose.Schema({
    productname:{
        type:String,
        required:true,
        trim:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    sellprice:{
        type:Number,
        required:true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})

module.exports = mongoose.model("OrderLineItem",orderlineitemSchema)