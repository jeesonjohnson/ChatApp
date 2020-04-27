const express = require("express");
const workspaceController = require("./../controllers/workspaceController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/all").get(workspaceController.getAllWorkspaces); //Should be deleted from production!!!!!!!

//Routes, that allow the user to get applicable workspaces. And create a workspace if they are admin
router
  .route("/")
  .post(authController.protect, workspaceController.createWorkspace)
  .get(authController.protect, workspaceController.getUserWorkspacesFromCompany);

  //Methods regarding the user association with a given workspace.
router
  .route("/user")
  .post(authController.protect, workspaceController.addUserToWorkspace)
  .delete(authController.protect, workspaceController.deleteUserFromWorkspace);

  //THe below should really be changed to  make it part of default route... do this later!!!!!!!!!!!!!
router
  .route("/:id")
  .get(authController.protect, workspaceController.getAGivenWorkspace);

module.exports = router;
