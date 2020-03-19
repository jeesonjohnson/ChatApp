const express = require("express");
const groupMessageController = require("./../controllers/groupMessageController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/alldata").get(groupMessageController.getAllMessages); //Should be deleted from production!!!!!!!

router
  .route("/all")
  .get(authController.protect, groupMessageController.getAllMessagesInGroup); 

router
  .route("/")
  .get(authController.protect, groupMessageController.getAGroupMessage)
  .post(authController.protect, groupMessageController.createAGroupMessage);

module.exports = router;
