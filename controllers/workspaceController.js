const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const company = require("./../models/Company");
const AppError = require("./../utils/appError");

//SHould be deleted on production
exports.getAllWorkspaces = catchAsync(async (req, res, next) => {
  const workspaceData = await Workspace.find();
  res.status(200).json({
    status: "success",
    results: workspaceData.length,
    data: workspaceData
  });
});

exports.createWorkspace = catchAsync(async (req, res, next) => {
  var companyDetails = await company.findById(req.body.company);
  //Only an admin should be able to create a workspace
  if (!companyDetails.admins.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not an admin to this company. You have no right to create a workspace",
        401
      )
    );
  }
  var newWorkspace = await Workspace.create({
    name: req.body.name,
    admins: [companyDetails.ownerID, req.user.id],
    users: [companyDetails.ownerID, req.user.id]
  });
  companyDetails.workspaces.push(newWorkspace.id);
  await company.findByIdAndUpdate(companyDetails.id, companyDetails, {
    new: true
  });
  res.status(200).json({
    status: "success",
    data: newWorkspace
  });
});

//Gets all associated workspaces in a company that are associated with a given user
exports.getUserCompanyWorkspaces = catchAsync(async (req, res, next) => {
  //If the user is the owner then all the workspaces are presented to the owner
  if (req.user.owner) {
    var ownerCompany = req.user.companies[0];
    var workspaces = [];
    var companyDetails = await company.findById(ownerCompany);
    for (var x = 0; x < companyDetails.workspaces.length; x++) {
      var workspaceDetails = await Workspace.findById(
        companyDetails.workspaces[x]
      );
      workspaces.push(workspaceDetails);
    }
    res.status(200).json({
      status: "success",
      data: workspaces
    });
  }

  // All the workspace are presented to the user, if they are in fact a member of the users of that workspace.
  var workspaces = [];
  var companyDetails = await company.findById(req.params.id);
  for (var x = 0; x < companyDetails.workspaces.length; x++) {
    var workspaceDetails = await Workspace.findById(
      companyDetails.workspaces[x]
    );
    //Check if the user is in the list of users for that workspace.
    for (var y = 0; y < workspaceDetails.users.length; x++) {
      if (workspaceDetails.users[y] == req.user.id) {
        workspaces.push(workspaceDetails);
      }
    }
  }
  res.status(200).json({
    status: "success",
    data: workspaces
  });
});

//TODO 1)Get user specfic workspaces in a company
//TODO 2)Add a user to a workspace
//TODO 3)Delete a user from a workspace
//TODO 4)
