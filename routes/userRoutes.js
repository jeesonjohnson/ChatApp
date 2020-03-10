const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

//Send data for new user
router.post("/signup", authController.signup);

//Send data for checking and logging in user
router.post("/login", authController.login);

//Route for getting all users
router.route("/").get(userController.getAllUsers); //SHOULD BE DELETED ON DEPLOYMENT

//Route for actions for user account, given am account
router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.protect, userController.updateUser); //.delete() needs to be done....

module.exports = router;
