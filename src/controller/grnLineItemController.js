const grnLineItem = require("../model/grnLineItemModel");

const isValid = (value) => {
    if (typeof value === "undefined" ||  value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
  }


const createGrnItem = async function (req,res){
    try {
        let data = req.body;
        let {productNmae,quantity,stckPrice} = data;
        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:"please provide data to create grn Line Item"})
        }

        if(!isValid(productNmae)){
            return res.status(400).send({status:false,message:"please provide a valid product name"})
        }
        if(typeof productNmae !=String){
            return res.status(400).send({status:false,message:"product name should be a String"})
        }


    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}