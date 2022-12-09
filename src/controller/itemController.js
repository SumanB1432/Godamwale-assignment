const itemModel = require("../model/itemModel");

const isValid = (value) => {
    if (typeof value === "undefined" ||  value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
  }


////////////////////////////////////////------------------CREATE ITEM--------------------------------/////////////////////////////////////////

const createItem = async function (req,res){
    try {
        let data = req.data;
        let {productname,quantity,stockPrice,sellprice}=data;


        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:'please provide data to create item'})
        }

        if(!isValid(productname)){
            return res.status(400).send({status:false,message:"please provide product name"})
        }
        let getProduct = await itemModel.findOne({productname:productname,isDeleted:false});

        if(getProduct){
            return res.status(400).send({status:false,message:"This product is already registered"})
        }

        if(!isValid(quantity)){
            return res.status(400).send({status:false,message:"please provide quantity"})
        }
        if(!(/^[0-9]+$/).test(quantity)){
            return res.status(400).send({status:false,message:"Puantity should be in number formate "})
        }
        if(!isValid(stockPrice)){
            return res.status(400).send({status:false,message:"please provide stock price"})
        }
        if(!(/^\d+(,\d{1,2})?$/).test(stockPrice)){
            return res.status(400).send({status:false,message:"stock price should be in number formate "})
        }

        if(!isValid(sellprice)){
            return res.status(400).send({status:false,message:"please provide sellprice"})
        }

        if(!(/^\d+(,\d{1,2})?$/).test(sellprice)){
            return res.status(400).send({status:false,message:"Puantity should be in number formate "})
        }

        let createItem = await itemModel.create(data);
        return res.status(201).send({status:true,message:"ceated successfully",data:createItem})

        
    } catch (error) {
        res.status(500).send({status:false,message:error.message})
    }
}

module.exports = {createItem}