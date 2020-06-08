const express = require("express");
const groupChatController = require("./../controllers/groupChatController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, groupChatController.getAGivenGroupChat)
  .delete(authController.protect, groupChatController.deleteAGroupChat)
  .patch(authController.protect, groupChatController.addAUserToGroupChat)
  .post(authController.protect, groupChatController.createGroupChat);

module.exports = router;
