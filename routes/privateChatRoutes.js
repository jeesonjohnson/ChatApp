const express = require("express");
const privateChatController = require("./../controllers/privateChatController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/alldata").get(privateChatController.getAllPrivateChats); //Should be deleted from production!!!!!!!

router
  .route("/")
  .get(
    authController.protect,
    privateChatController.getAllPrivateChatsAssocaitedWithUser
  )
  .delete(authController.protect, privateChatController.deleteAPrivateChat)
  .post(authController.protect, privateChatController.creatPrivateChat);

module.exports = router;
