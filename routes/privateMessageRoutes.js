const express = require("express");
const privateMessageController = require("./../controllers/privateMessageController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/alldata").get(privateMessageController.getAllMessages); //Should be deleted from production!!!!!!!

router
  .route("/all")
  .get(authController.protect, privateMessageController.getAllMessagesInPrivateChat); 

router
  .route("/")
  .get(authController.protect, privateMessageController.getAPrivateMessage)
  .post(authController.protect, privateMessageController.createAPrivateMessage);

module.exports = router;
