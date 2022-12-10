const mongoose = require("mongoose");
const itemModel = require("../model/itemModel");
const orderLineItemModel = require("../model/orderLineItemModel");
const orderModel = require("../model/orderModel");



const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


///////////////////////////////-----------CREATE ORDER--------------------------//////////////////////////////////////////

const createOrder = async function (req, res) {
    try {
        const data = req.body;
        // console.log(data)
        let {
            invoiceNumber,
            customerName,
            customerAddress,
            orderLineItems
        } = data;
        if (!data) {
            return res.status(400).send({
                status: false,
                message: "please provide data to create order"
            })
        }
        // console.log(data)

        if (!isValid(invoiceNumber)) {
            return res.status(400).send({
                status: false,
                message: "please provide invoice number"
            })
        }

        let getInvoice = await orderModel.findOne({
            invoiceNumber: invoiceNumber,
            isDeleted: false
        });
        if (getInvoice) {
            return res.status(400).send({
                status: false,
                message: `${invoiceNumber} is already registered`
            })
        }

        if (!isValid(customerName)) {
            return res.status(400).send({
                status: false,
                message: "please provide customer name"
            })
        }


        if (!isValid(customerAddress)) {
            return res.status(400).send({
                status: false,
                message: "please provide addrres"
            })
        }

        if (!isValid(orderLineItems)) {
            return res.status(400).send({
                status: false,
                message: "please provide order line item"
            })
        }

        if (!mongoose.isValidObjectId(orderLineItems)) {
            return res.status(400).send({
                status: false,
                message: "invalid order line item"
            })
        }

        const getorderlineitem = await orderLineItemModel.findOne({
            _id: orderLineItems,
            isDeleted: false
        });
        if (!getorderlineitem) {
            return res.status(404).send({
                status: false,
                message: "This order line item is not exist"
            })
        }

        let createOrder = await orderModel.create(data)
        return res.status(201).send({
            status: true,
            message: "successfull",
            data: createOrder
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}
//////////////////-------UPDATE ORDER---------------/////////////////////////////////
const updateOrder = async function (req, res) {
    try {
        let data = req.body.status;
        let orderId = req.params.orderId;

        if (!isValid(data)) {
            return res.status(400).send({
                status: false,
                message: "please provide some data to update"
            })
        }
        let getOrder = await orderModel.findOne({
            _id: orderId,
            isDeleted: false
        });
        if (!getOrder) {
            return res.status(404).send({
                status: false,
                message: `${orderId} is not valid or already deleted`
            })
        }
        let status = data.toUpperCase()
        let statusArray = ['GENERATED', 'COMPLETED', 'CANCELED'];
        if (statusArray.indexOf(status) == -1) {
            return res.status(404).send({
                status: false,
                message: `status should be ${statusArray}`
            })
        }

        if (status == 'GENERATED') {
            return res.status(400).send({
                status: false,
                message: "Order already Generated"
            })
        }

        if (status == "CANCELED") {
            await orderModel.findOneAndUpdate({
                _id: orderId
            }, {
                isDeleted: true
            })
        }
        if (status == "COMPLETED") {
            let orderListItem = await orderLineItemModel.findOne({
                _id: getOrder.orderLineItems
            })
            let itemName = orderListItem.productname;

            let Item = await itemModel.findOne({
                productname: itemName
            });
            let remainingQuantity = Item.quantity - orderListItem.quantity;
            await itemModel.findOneAndUpdate({
                productname: itemName
            }, {
                quantity: remainingQuantity
            }, {
                new: true
            })
        }

        let updateOrder = await orderModel.findOneAndUpdate({
            _id: orderId
        }, {
            status: status
        }, {
            new: true,
            upsert: true
        });
        return res.status(200).send({
            status: true,
            message: "update successfully",
            data: updateOrder
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}
//////////////////////////////------GET ORDER------------------------///////////////////////////////
const getOrder = async function (req, res) {
    try {
        let orderId = req.params.orderId;
        if (!orderId) {
            return res.status(400).send({
                status: false,
                message: "please provide orderId to get order details"
            })
        }
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).send({
                status: false,
                message: `${orderId} is not valid`
            })
        }
        let getOrder = await orderModel.findOne({
            _id: orderId,
            isDeleted: false
        });
        if (!getOrder) {
            return res.status(404).send({
                status: false,
                message: `${orderId} is not found`
            })
        }
        let orderLineItems = await orderLineItemModel.findOne({
            _id: getOrder.orderLineItems
        });
        let totaldata = {
            invoiceNumb: getOrder.invoiceNumber,
            customerName: getOrder.customerName,
            status: getOrder.status,
            customerAddress: getOrder.customerAddress,
            orderLineItems: [orderLineItems],
            date: getOrder.date,
            isDeleted: getOrder.isDeleted,


        }
        return res.status(200).send({
            status: true,
            message: "successfull",
            data: totaldata
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}
////////////////////////////////-----------DELETE ORDER------------------/////////////////////////////////////////////////////////
const deleteOrder = async function (req, res) {
    try {
        let orderId = req.params.orderId;
        if (!orderId) {
            return res.status(400).send({
                status: false,
                message: "please provide orderid"
            })
        }
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).send({
                status: false,
                message: `${orderId} is not valid`
            })
        }
        let getOrder = await orderModel.findOneAndUpdate({
            _id: orderId,
            isDeleted: false
        }, {
            isDeleted: true,
            status: "CANCELED"
        }, {
            new: true
        })
        if (!getOrder) {
            return res.status(404).send({
                status: false,
                message: "This order is not exist"
            })
        }
        return res.status(200).send({
            status: true,
            message: "Deleted successfully",
            data: getOrder
        })

    } catch (error) {
        res.status(500).send({
            status: false,
            mesage: error.message
        })
    }
}
module.exports = {
    createOrder,
    updateOrder,
    getOrder,
    deleteOrder
}