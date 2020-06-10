const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const Company = require("./../models/Company");
const GroupChat = require("./../models/GroupChat");
const GroupMessage = require("./../models/GroupMessage");
const AppError = require("./../utils/appError");

//################ CREATE A NEW GROUP CHAT ##############
exports.createGroupChat = catchAsync(async (req, res, next) => {
  var workspaceDetails = await Workspace.findById(req.body.workspaceid);

  //Only a user in a workspace should be able to create groupchat
  if (!workspaceDetails.users.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not a member of this given workspace. You have no right to create a group chat",
        401
      )
    );
  }
  
  //So that if the owner of a company creates the workspace their id is not repeated...
  var groupUsers = req.body.users;
  if (!groupUsers.includes(req.user.id)) {
    groupUsers.push(req.user.id);
  }
  
  var newGroupChat = await GroupChat.create({
    workspaceID: req.body.workspaceid,
    title: req.body.name,
    users: groupUsers
  });

  workspaceDetails.group_chats.push(newGroupChat.id);

  await Workspace.findByIdAndUpdate(workspaceDetails.id, workspaceDetails, {
    new: true
  });

  res.status(200).json({
    status: "success",
    data: newGroupChat,
    workspace: workspaceDetails
  });
});

// ######## Return a  given group chat given its id ############
exports.getAGivenGroupChat = catchAsync(async (req, res, next) => {
 var groupChatDetails = await GroupChat.findById(req.query.group_id);
  res.status(200).json({
    status: "success",
    data: groupChatDetails
  });
});

// ################# Delete a group chat form the server ################
exports.deleteAGroupChat = catchAsync(async (req, res, next) => {
  var groupChatDetails = await GroupChat.findById(req.query.group_id);
  var workspaceData = await Workspace.findById(groupChatDetails.workspaceID);

  if (!workspaceData.users.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not a member of this given workspace. You have no right to delete a group chat",
        401
      )
    );
  }
  //Delete all messages in a given group
  await GroupMessage.deleteMany({ group_id: groupChatDetails.id });
  //Delete a collection form a workspace
  for (var x = 0; x < workspaceData.group_chats.length; x++) {
    if (workspaceData.group_chats[x] == groupChatDetails.id) {
      workspaceData.group_chats.splice(x, 1);
      break;
    }
  }
  await Workspace.findByIdAndUpdate(workspaceData.id, workspaceData, {
    new: true
  });

  //Remove the collection details
  await GroupChat.findByIdAndDelete(groupChatDetails.id);
  res.status(200).json({
    status: "success",
    data: "data has been deleted"
  });
});

// ########### ADD A GIVEN USER TO A GROUP CHAT  ##############
exports.addAUserToGroupChat = catchAsync(async (req, res, next) => {
  var groupChatDetails = await GroupChat.findById(req.body.groupid);
  //Only if the appropaite methods are present then does it add the data for the update field
  if (req.body.title != "") {
    groupChatDetails.title = req.body.title;
  }
  if (req.body.todo_id != "") {
    groupChatDetails.users.push(req.body.userid);
  }

  groupChatDetails = await GroupChat.findByIdAndUpdate(
    groupChatDetails.id,
    groupChatDetails,
    {
      new: true
    }
  );
  res.status(200).json({
    status: "success",
    data: groupChatDetails
  });
});

exports.deleteUserFromGroupChat = catchAsync(async (req, res, next) => {
  var groupChatDetails = await GroupChat.findById(req.query.group_id)

  let newUsers = []
  for(var i in groupChatDetails.users){
    if(groupChatDetails.users[i] !== req.params.id)
      await newUsers.push(groupChatDetails.users[i])
  }
  
  groupChatDetails.users = newUsers

  await GroupChat.findByIdAndUpdate(req.query.group_id, groupChatDetails)

  res.status(200).json({
    status: "success",
  })

  
});