const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const grnSchema = new mongoose.Schema({
    vendorname:{
      type:String,
      required:true,
      uppercase:true,
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
    endorAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: Number, required: true }
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

