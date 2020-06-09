const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const Company = require("./../models/Company");
const AppError = require("./../utils/appError");
const GroupChat =  require("./../models/GroupChat")
const PrivateChat = require("./../models/PrivateChat")

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
  var companyDetails = await Company.findById(req.body.company);
  //Only an admin should be able to create a workspace
  if (!companyDetails.admins.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not an admin to this company. You have no right to create a workspace",
        401
      )
    );
  }
  //So that if the owner of a company creates the workspace their id is not repeated...
  var compAdmins = [req.user.id];
  var compUsers = [req.user.id];
  if (companyDetails.ownerID != req.user.id) {
    compAdmins.push(companyDetails.ownerID);
    compUsers.push(companyDetails.ownerID);
  }
  var newWorkspace = await Workspace.create({
    name: req.body.name,
    admins: compAdmins,
    users: compUsers
  });
  companyDetails.workspaces.push(newWorkspace.id);
  await Company.findByIdAndUpdate(companyDetails.id, companyDetails, {
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
    var companyDetails = await Company.findById(ownerCompany);
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
  var companyDetails = await Company.findById(req.query.id);
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

//* Allow A given user to be added to a workspace.
exports.addUserToWorkspace = catchAsync(async (req, res, next) => {
  var workspaceDetails = await Workspace.findById(req.body.workspace_id);
  if (!workspaceDetails.admins.includes(req.user.id)) {
    return next(new AppError("Only admins can add people to a workspace", 201));
  }
  //If the user is an admin, then add the user to the workspace admins
  if (req.body.admin == "true") {
    workspaceDetails.admins.push(req.body.user_id);
  }
  //Add a given user to the workspace
  workspaceDetails.users.push(req.body.user_id);
  await Workspace.findByIdAndUpdate(workspaceDetails.id, workspaceDetails, {
    new: true
  });
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
      company: workspaceDetails
    }
  });
});

//** Deletes a given user from a given workspace, provided the user_id and workspace_id */
exports.deleteUserFromWorkspace = catchAsync(async (req, res, next) => {
  var workspaceDetails = await Workspace.findById(req.query.workspace_id);
  //If the currently loggeed in user is an admin, we can access the current user details
  //Since we are validating the user details with the current middleware. so req.user.id is currently logged in user
  if (!workspaceDetails.admins.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not an admin to this workspace. You have no right to remove users",
        401
      )
    );
  }
  //Find the given user, if and remove from the list of users in the workspace
  var userToDel = await User.findById(req.query.user_id);
  for (var x = 0; x < workspaceDetails.users.length; x++) {
    if (workspaceDetails.users[x] == userToDel.id) {
      workspaceDetails.users.splice(x, 1);
      break;
    }
  }

  //If the user to  be deleted is an admin, then remove them from workspace admins
  if (workspaceDetails.admins.includes(userToDel.id)) {
    for (var x = 0; x < workspaceDetails.admins.length; x++) {
      if (workspaceDetails.admins[x] == userToDel.id) {
        workspaceDetails.admins.splice(x, 1);
        break;
      }
    }
  }

  //Updates the database vlues for the user workspace and user
  await User.findByIdAndUpdate(userToDel.id, userToDel, { new: true });
  await Workspace.findByIdAndUpdate(workspaceDetails.id, workspaceDetails, {
    new: true
  });
  res.status(200).json({
    status: "success",
    data: {
      user: userToDel,
      company: workspaceDetails
    }
  });
});


//Get a given workspace given its id
exports.getAGivenWorkspace = catchAsync(async (req, res, next) => {
  var workspaceDetails = await Workspace.findById(req.params.id);

  //Get the associated groupChats in a workspace
  var groupChats =  await GroupChat.find().where("workspaceID").in([req.params.id]).exec();
  workspaceDetails.group_chats = groupChats;

  //Get the assocaied private chats in a group
  var privateChats = await PrivateChat.find().where("workspaceID").in([req.params.id]).exec();
  workspaceDetails.private_chats = privateChats;

  
  res.status(200).json({
    status: "success",
    data: {
      workspaceDetails
    }
  });
});