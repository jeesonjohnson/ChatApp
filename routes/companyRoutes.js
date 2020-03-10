const express = require("express");
const companyController = require("./../controllers/companyController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/all").get(companyController.getAllCompanies); //Should be deleted from production!!!!!!!

//Get details about a given company provided their details are present
router.route("/:id").get(authController.protect, companyController.getCompany);


//Get all companies associated with a given user account. Delete allows the user to be delete form a company
// Delete signature {{URL}}/companies/?user_id={The user ID}&company_id={The company id}
router
  .route("/")
  .get(authController.protect, companyController.getAllUserCompanies)
  .delete(authController.protect, companyController.deleteUserFromCompany);;

module.exports = router;
