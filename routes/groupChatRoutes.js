const express = require("express");
const groupChatController = require("./../controllers/groupChatController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/alldata").get(groupChatController.getAllGroupChats); //Should be deleted from production!!!!!!!


router
  .route("/")
  .get(authController.protect, groupChatController.getAGivenGroupChat)
  .delete(authController.protect, groupChatController.deleteAGroupChat)
  .patch(authController.protect, groupChatController.addAUserToGroupChat)
  .post(authController.protect, groupChatController.creatGroupChat);

module.exports = router;
