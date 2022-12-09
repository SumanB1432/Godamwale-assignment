const mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    invoiceNumber:{
        type:Number,
        required:true,
    },
    customerNmae:{
        type:String,
        required:true,

    },
    status:{
        type:String,
        default: 'GENERATED',
        enum: ['GENERATED','COMPLETED','CANCELED'],
        trim: true
    },
    customerAddress:{
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: Number, required: true }
    },
    orderLineItems:{
        type:objectId,
        ref:"OrderLineItem",
        required:true,

    },
    date:{
        type:Date,
        default:Date.now(),
        
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})

module.exports = mongoose.model("Order",orderSchema)