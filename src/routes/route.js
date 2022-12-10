const express = require("express");
const router = express.Router();
let itemController = require("../controller/itemController");
let orderlineitemController = require("../controller/orderLineListController")
let orderController = require("../controller/orderController")
let grnLineItemController = require("../controller/grnLineItemController")
let grnController = require("../controller/grnController")

router.post("/createItem", itemController.createItem);

router.get("/getItem", itemController.getItem);

router.post("/createOrderlist", orderlineitemController.createOrderLine);

router.post("/createOrder", orderController.createOrder);

router.put("/updateOrder/:orderId", orderController.updateOrder);

router.get("/getOrder/:orderId", orderController.getOrder);

router.delete("/deleteOrder/:orderId", orderController.deleteOrder);

router.post("/creategrnLineItem", grnLineItemController.createGrnItem);


router.post("/createGrn", grnController.createGrn);

router.get("/getGrn/:grnId", grnController.getGrn);

router.delete("/deleteGrn/:grnId", grnController.deleteGrn)

router.put("/updateGrn/:grnId", grnController.updateGrn)











router.all("/**", function (req, res) {
  res.status(400).send({
    status: false,
    message: "INVALID END-POINT: The API You requested is NOT available.",
  });
});
module.exports = router