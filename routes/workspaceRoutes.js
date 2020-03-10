const express = require("express");
const workspaceController = require("./../controllers/workspaceController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/all").get(workspaceController.getAllWorkspaces); //Should be deleted from production!!!!!!!

//Routes, that allow the user to get applicable workspaces. And create a workspace if they are admin
router
  .route("/")
  .post(authController.protect, workspaceController.createWorkspace)
  .get(authController.protect, workspaceController.getUserCompanyWorkspaces);
  

router
  .route("/user")
  .post(authController.protect, workspaceController.addUserToWorkspace)
  .delete(authController.protect, workspaceController.deleteUserFromWorkspace);
// //Get details about a given company provided their details are present
// router
//   .route("/:id")
//   .get(authController.protect, companyController.getCompany)
//   .patch(authController.protect, companyController.addUserToCompany);

// //Get all companies associated with a given user account. Delete allows the user to be delete form a company
// // Delete signature {{URL}}/companies/?user_id={The user ID}&company_id={The company id}
// router
//   .route("/")
//   .get(authController.protect, companyController.getAllUserCompanies)
//   .delete(authController.protect, companyController.deleteUserFromCompany);

module.exports = router;
