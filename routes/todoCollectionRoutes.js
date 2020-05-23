const express = require("express");
const todoCollectionController = require("./../controllers/todoCollectionController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/all")
  .get(
    authController.protect,
    todoCollectionController.getAllCollectionsInWorkspace
  );

router
  .route("/")
  .get(authController.protect, todoCollectionController.getAGivenCollection)
  .delete(authController.protect, todoCollectionController.deleteACollection)
  .patch(authController.protect, todoCollectionController.addATodoToCollection)
  .post(authController.protect, todoCollectionController.createCollection);

module.exports = router;
