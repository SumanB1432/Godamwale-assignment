const grnLineItemModel = require("../model/grnLineItemModel");
const itemModel = require("../model/itemModel");


const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


const createGrnItem = async function (req, res) {
    try {
        let data = req.body;
        let {
            productName,
            quantity,
            stockPrice
        } = data;
        if (!Object.keys(data).length) {
            return res.status(400).send({
                status: false,
                message: "please provide data to create grn Line Item"
            })
        }

        if (!isValid(productName)) {
            return res.status(400).send({
                status: false,
                message: "please provide a valid product name"
            })
        }


        let getItem = await itemModel.findOne({
            productname: productName,
            isDeleted: false
        });
        if (!getItem) {
            return res.status(404).send({
                status: false,
                message: `${productName} is not found`
            })
        }

        if (!isValid(quantity)) {
            return res.status(400).send({
                status: false,
                mesage: "please provide quantity"
            })
        }
        if (!(/^[0-9]+$/).test(quantity)) {
            return res.status(400).send({
                status: false,
                message: "Quantity should be a number"
            })
        }
        const createData = {
            productName: productName,
            quantity: quantity,
            stockPrice: getItem.stockPrice,
        }

        let creategrnLineItem = await grnLineItemModel.create(createData);
        return res.status(201).send({
            status: true,
            message: "successfull",
            data: creategrnLineItem
        })




    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    createGrnItem
}