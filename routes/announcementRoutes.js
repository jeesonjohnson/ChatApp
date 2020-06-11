const express = require("express");
const announcementController = require("../controllers/announcementController");
const authController = require("../controllers/authController");

const router = express.Router();

//Get details about a given company provided their details are present
router
  .route('/')
  .get(authController.protect, announcementController.getMessages)
  .post(authController.protect, announcementController.addMessage)

router
  .route("/:id")
  .delete(authController.protect, announcementController.deleteMessage);

module.exports = router;
