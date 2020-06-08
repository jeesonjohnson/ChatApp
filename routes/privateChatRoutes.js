const express = require("express");
const privateChatController = require("./../controllers/privateChatController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, privateChatController.getAllPrivateChatsAssocaitedWithUser)
  .delete(authController.protect, privateChatController.deleteAPrivateChat)
  .post(authController.protect, privateChatController.createPrivateChat);

module.exports = router;
