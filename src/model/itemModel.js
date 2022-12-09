const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    productname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    stockPrice: {
      type: Number,
      required: true,
    },
    sellprice: {
      type: Number,
      required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
