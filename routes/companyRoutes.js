const express = require("express");
const companyController = require("./../controllers/companyController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/all").get(companyController.getAllCompanies); //Should be deleted from production!!!!!!!

//Get details about a given company provided their details are present
router.route("/:id").get(companyController.getCompany);

//Get all companies associated with a given user account
router.route("/").get(authController.protect, companyController.getAllUserCompanies);

module.exports = router;
