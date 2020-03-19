const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const Company = require("./../models/Company");
const GroupChat = require("./../models/GroupChat");
const GroupMessage = require("./../models/GroupMessage");
const AppError = require("./../utils/appError");

//SHould be deleted on production
exports.getAllMessages = catchAsync(async (req, res, next) => {
  const groupMessage = await GroupMessage.find();
  res.status(200).json({
    status: "success",
    results: groupMessage.length,
    data: groupMessage
  });
});

// ################## Create a group message ###################
exports.createAGroupMessage = catchAsync(async (req, res, next) => {
  var groupChat = await GroupChat.findById(req.body.group_id);
  if (!groupChat.users.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not a member of this chat, you have no right to send messages",
        401
      )
    );
  }
  //Actual create a group message.
  var newGroupMessage = await GroupMessage.create({
    group_id: req.body.group_id,
    author: req.user.id,
    message: req.body.message,
    time_sent: Date.now(),
    file_url: req.body.file_url
  });

  res.status(200).json({
    status: "success",
    data: newGroupMessage
  });
});

// ################ Return a given group message #################
exports.getAGroupMessage = catchAsync(async (req, res, next) => {
  var messageDetails = await GroupMessage.findById(req.query.message_id);
  res.status(200).json({
    status: "success",
    data: messageDetails
  });
});

// ###################### Get all messages in a given group chat ###################
exports.getAllMessagesInGroup = catchAsync(async (req, res, next) => {
  const collectionData = await Collection.findById(req.query.collection_id);
  var answer = [];
  for (var x = 0; x < collectionData.to_do_elements.length; x++) {
    answer.push(await TodoElement.findById(collectionData.to_do_elements[x]));
  }
  res.status(200).json({
    status: "success",
    data: answer
  });
});
