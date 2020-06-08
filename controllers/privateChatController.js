const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const Company = require("./../models/Company");
const PrivateChat = require("./../models/PrivateChat");
const PrivateMessage = require("./../models/PrivateMessage");
const AppError = require("./../utils/appError");

//################ CREATE A NEW GROUP CHAT ##############
exports.createPrivateChat = catchAsync(async (req, res, next) => {
  var workspaceDetails = await Workspace.findById(req.body.workspaceid);
  //Only a user in a workspace should be able to create groupchat
  if (
    !workspaceDetails.users.includes(req.user.id) &&
    !workspaceDetails.users.includes(req.body.oppositeid)
  ) {
    return next(
      new AppError(
        "You are not a member of this given workspace. You have no right to create a group chat",
        401
      )
    );
  }

  var result1 = await PrivateChat.find({
    user1: req.body.oppositeid,
    user2: req.user.id
  });
  var result2 = await PrivateChat.find({
    user2: req.body.oppositeid,
    user1: req.user.id
  });
  if (result1.length != 0 || result2.length != 0) {
    return next(
      new AppError("This conversation already exists between users", 401)
    );
  }

  var newPrivateChat = await PrivateChat.create({
    workspaceID: req.body.workspaceid,
    user1: req.body.oppositeid,
    user2: req.user.id
  });
  workspaceDetails.private_chats.push(newPrivateChat.id);
  await Workspace.findByIdAndUpdate(workspaceDetails.id, workspaceDetails, {
    new: true
  });
  res.status(200).json({
    status: "success",
    data: newPrivateChat,
    workspace: workspaceDetails
  });
});

// ######## Return a  given private chat given its id ############
exports.getAllPrivateChatsAssocaitedWithUser = catchAsync(
  async (req, res, next) => {
    var result1 = await PrivateChat.find({
      user1: req.body.oppositeid
    });
    var result2 = await PrivateChat.find({
      user2: req.user.id
    });

    res.status(200).json({
      status: "success",
      data: result1.concat(result2)
    });
  }
);

// ################# Delete a group chat form the server ################
exports.deleteAPrivateChat = catchAsync(async (req, res, next) => {
  var privateChatDetails = await PrivateChat.findById(req.query.private_id);
  var workspaceData = await Workspace.findById(privateChatDetails.workspaceID);
  //validation for the user being in the workpace
  if (!workspaceData.users.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not a member of this given workspace. You have no right to delete a private chat",
        401
      )
    );
  }

  if (
    privateChatDetails.user1 != req.user.id &&
    privateChatDetails.user2 != req.user.id
  ) {
    return next(
      new AppError(
        "You are not a member of his chat, and therefore you cannot delete this chat.",
        401
      )
    );
  }
  //Delete all messages in a given group
  await PrivateMessage.deleteMany({ private_id: privateChatDetails.id });
  //Delete a collection form a workspace
  for (var x = 0; x < workspaceData.private_chats.length; x++) {
    if (workspaceData.private_chats[x] == privateChatDetails.id) {
      workspaceData.private_chats.splice(x, 1);
      break;
    }
  }
  await Workspace.findByIdAndUpdate(workspaceData.id, workspaceData, {
    new: true
  });

  //Remove the collection details
  await PrivateChat.findByIdAndDelete(privateChatDetails.id);
  res.status(200).json({
    status: "success",
    data: "data has been deleted",
    workspace: workspaceData
  });
});
