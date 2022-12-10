const { default: mongoose } = require("mongoose");
const grnLineItemModel = require("../model/grnLineItemModel");
const grnModel = require("../model/grnModel");
const orderModel = require("../model/orderModel");

const isValid = (value) => {
    if (typeof value === "undefined" ||  value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
  }

  /////////////////-----------------CREATE GRN -------------------------/////////////////////////////////
  const createGrn = async function(req,res){
    try {
        let data = req.body;
        let {vendorname,invoiceNumber,vendorAddress,grnLineItems}=data;

        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:"please provide the required data"})
        }
        if(!isValid(vendorname)){
            return res.status(400).send({status:false,message:"please provide vendor name"})
        }
        if(!(/^[a-z A-Z]+$/).test(vendorname)){
            return res.status(400).send({status:false,message:"please provide a valid name"})
        }
        if(!isValid(invoiceNumber)){
            return res.status(400).send({status:false,message:"please provide invoice number"})
        }
        let getInvoice = await orderModel.findOne({invoiceNumber:invoiceNumber,isDeleted:false});
        if(!getInvoice){
            return res.status(404).send({status:false,message:`${invoiceNumber} is not found`})
        }
        let getInvoiceFromGrn = await grnModel.findOne({invoiceNumber:invoiceNumber,isDeleted:false});
        if(getInvoiceFromGrn){
            return res.status(400).send({status:false,message:`${invoiceNumber} is already registered`})
        }
        if(!isValid(vendorAddress)){
            return res.status(400).send({status:false,message:"please provide vendor address"})
        }
        if(!isValid(grnLineItems)){
            return res.status(400).send({status:false,message:"please provide grnListitem"})
        }
        if(!mongoose.isValidObjectId(grnLineItems)){
            return res.status(400).send({status:false,message:`${grnLineItems} is not valid`})
        }

        let getGrnLineItem = await grnLineItemModel.findOne({_id:grnLineItems,isDeleted:false});
        if(!getGrnLineItem){
            return res.status(404).send({status:false,message:`${grnLineItems} is not found`})
        }

        const createGrn = await grnModel.create(data)
        return res.status(201).send({status:true,message:"successfull",data:createGrn})

        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
  }
////////////////-----GET GRN ------------------/////////////////////////////////////////

const getGrn = async function (req,res){
    try {
        let grnId = req.params.grnId;
        if(!grnId){
            return res.status(400).send({status:false,message:"please provide GRN id"})
        }
        if(!mongoose.isValidObjectId(grnId)){
            return res.status(400).send({status:false,message:`${grnId} is not valid`})
        }

        let getGrn = await grnModel.findOne({_id:grnId,isDeleted:false});

        if(!getGrn){
            return res.status(404).send({status:false,message:`${grnId} is not found`})
        }
        return res.status(200).send({status:true,message:"successfull",data:getGrn})
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

/////////////////////////////------------DELETE GRN ------------------------///////////////////////////////////////
const deleteGrn = async function(req,res){
    try {
        let grnId = req.params.grnId;
        if(!grnId){
            return res.status(400).send({status:false,message:"please provide grn id"})
        }
        if(!mongoose.isValidObjectId(grnId)){
            return res.status(400).send({status:false,message:`${grnId} is not valid`})
        }
        let getGrn = await grnModel.findOne({_id:grnId,isDeleted:false});
        if(!getGrn){
            return res.status(404).send({status:false,message:`${grnId} is not found`})
        }
        await grnModel.findOneAndUpdate({_id:grnId},{isDeleted:true});
        return res.status(200).send({status:true,message:"Deleted successfully"})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}
///////////////-----------UPDATE GRN -------------------///////////////////////////////////
const updateGrn = async function(req,res){
    try {
        let data = req.body.status;
        let grnId = req.params.grnId;
        if(!data){
            return res.status(400).send({status:false,message:"please provide status"})
        }
        if(!grnId){
            return res.status(400).send({status:false,message:"please provide grnId"})
        }
        if(!mongoose.isValidObjectId(grnId)){
            return res.status(400).send({status:false,message:`${grnId} is not valid`})
        }
        let getGrn = await grnModel.findOne({_id:grnId,isDeleted:false});
        if(!getGrn){
            return res.status(404).send({status:false,message:`${grnId} is not found`})
        }
        let status = data.toUpperCase()
        let statusArray = ['GENERATED', 'COMPLETED', 'CANCELED'];
        if (statusArray.indexOf(status) == -1) {
            return res.status(404).send({ status: false, message: `status should be ${statusArray}` })
        }

        if (status == 'GENERATED') {
            return res.status(400).send({ status: false, message: "GRN is already Generated" })
        }

        if (status == "CANCELED") {
            let cancleGrn = await grnModel.findOneAndUpdate({ _id: grnId }, { isDeleted: true ,status:status},{new:true})
            return res.status(200).send({status:true,message:"update successfully",data:cancleGrn})
        }
        if (status == "COMPLETED") {
          
            let completedGrn = await grnModel.findOneAndUpdate({ _id:grnId }, { status:status },{new:true});
            return res.status(200).send({status:true,message:"updated successfully",data:completedGrn})
        }
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}
  module.exports = {createGrn,getGrn,deleteGrn,updateGrn}

