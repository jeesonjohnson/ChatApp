const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

//Send data for new user
router.post("/signup", authController.signup);

//Send data for checking and logging in user
router.post("/login", authController.login);

router.route("/logout").get(authController.logout)

router.route("/status").get(userController.isUserLoggedIn, authController.protect, userController.getCurrentUser);

router.route("/names").get(userController.getUsersByName)

//Route for actions for user account, given am account
router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.protect, userController.updateUser); //.delete() needs to be done....

module.exports = router;
