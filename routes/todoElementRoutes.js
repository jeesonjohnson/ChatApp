const express = require("express");
const todoElementController = require("./../controllers/todoElementController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/alldata").get(todoElementController.getAllTodoElements); //Should be deleted from production!!!!!!!

router
  .route("/all")
  .get(authController.protect, todoElementController.getAlltodoInCollection);

router
  .route("/")
  .get(authController.protect, todoElementController.getAGivenTodo)
  .delete(authController.protect, todoElementController.deleteATodoElementGivenID)
  .patch(authController.protect, todoElementController.updateATodoElement)
  .post(authController.protect, todoElementController.createTodo);

module.exports = router;
