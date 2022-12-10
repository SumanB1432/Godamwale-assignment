const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const grnSchema = new mongoose.Schema({
    vendorname:{
      type:String,
      required:true,
      trim:true,
    },
    invoiceNumber:{
        type:Number,
        required:true,
        unique:true,
    },
    date:{
        type:Date,
        default:Date.now(),
        
    },
    vendorAddress: {
        type:String,
        required:true,
          },
    grnLineItems:{
        type:objectId,
        required:true,
        ref:"GrnListItem"

    },
    status:{
        type:String,
        default: 'GENERATED',
        enum: ['GENERATED','COMPLETED','CANCELED'],
        trim: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('grn', grnSchema)

