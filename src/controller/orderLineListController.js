const itemModel = require("../model/itemModel");
let orderListModel = require("../model/orderLineItemModel");

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const createOrderLine = async function (req, res) {
  try {
    let data = req.body;
    let {
      productname,
      quantity
    } = data;

    if (!Object.keys(data).length) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide data to create order line item",
        });
    }
    if (!isValid(productname)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide product name"
        });
    }
    let getProduct = await itemModel.findOne({
      productname: productname,
      isDeleted: false,
    });
    if (!getProduct) {
      return res
        .status(404)
        .send({
          status: false,
          message: `${productname} is not found`
        });
    }
    let getOrder = await orderListModel.findOne({
      productname: productname,
      isDeleted: false,
    });

    if (!isValid(quantity)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide quentity"
        });
    }
    if (quantity == 0) {
      return res.status(400).send({
        status: false,
        message: "quantity should be greter then 0"
      })
    }
    //CHECK QUANTITY
    let avilableQuantity;
    if (!getOrder) {
      avilableQuantity = quantity;
    } else {
      avilableQuantity = quantity + getOrder.quantity;
    }
    if (getProduct.quantity < avilableQuantity) {
      return res
        .status(400)
        .send({
          status: false,
          message: `available quantity is ${getProduct.quantity}`,
        });
    }
    if (getProduct.quantity == 0) {
      return res.status(400).send({
        status: false,
        message: "out of stock"
      });
    }
    //FIND TOTAL PRICE AND QUANTITY
    let price;
    let totalQuantity;
    if (getOrder) {
      price = getProduct.sellprice * quantity + getOrder.sellprice;
      totalQuantity = getOrder.quantity + quantity;
    }

    let createDtata = {
      productname: productname,
      quantity: quantity,
      sellprice: getProduct.sellprice * quantity,
    };
    if (!getOrder) {
      const createOrderList = await orderListModel.create(createDtata);
      return res
        .status(201)
        .send({
          status: true,
          message: "successfull",
          data: createOrderList
        });
    } else {
      const updateOrderList = await orderListModel.findOneAndUpdate({
        productname: productname,
        isDeleted: false
      }, {
        prductname: productname,
        quantity: totalQuantity,
        sellprice: price
      }, {
        new: true,
        upsert: true
      });
      return res
        .status(201)
        .send({
          status: true,
          message: "successfull",
          data: updateOrderList
        });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message
    });
  }
};

///////////////---------DELETE ORDERLINELIST -----------------------///////////////////////////////


module.exports = {
  createOrderLine
};