const express = require("express");
const router = express.Router();
let itemController = require("../controller/itemController");
let orderlineitemController = require("../controller/orderLineListController")
let orderController = require("../controller/orderController")

router.post("/createItem",itemController.createItem);
router.get("/getItem",itemController.getItem)
router.post("/createOrderlist",orderlineitemController.createOrderLine)
router.post("/createOrder",orderController.createOrder)
router.put("/updateOrder/:orderId",orderController.updateOrder)
router.get("/getOrder/:orderId",orderController.getOrder)
router.delete("/deleteOrder/:orderId",orderController.deleteOrder)











router.all("/**", function (req, res) {
    res.status(400).send({
      status: false,
      message: "INVALID END-POINT: The API You requested is NOT available.",
    });
  });
module.exports = router


