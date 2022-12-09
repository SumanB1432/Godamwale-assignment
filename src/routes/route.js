const express = require("express");
const router = express.Router();
let itemController = require("../controller/itemController");

router.post("/createItem",itemController.createItem)











router.all("/**", function (req, res) {
    res.status(400).send({
      status: false,
      message: "INVALID END-POINT: The API You requested is NOT available.",
    });
  });
module.exports = {router}


