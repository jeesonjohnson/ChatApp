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
  // if (!groupChat.users.includes(req.body.author_id)) {
  //   return next(
  //     new AppError(
  //       "You are not a member of this chat, you have no right to send messages",
  //       401
  //     )
  //   );
  // }
  // console.log("HERERERER");
  // console.log(req.body);
  //Actual create a group message.
  var newGroupMessage = await GroupMessage.create({
    group_id: req.body.group_id,
    author_id: req.body.author_id,
    author:req.body.author,
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
  //Below code is for pagentation of methods
  const page = req.query.page * 1 || 1; //Ensures javascript parses the number correctly
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  // Gets all appropriate messages, and sorts them such to be descending based creation, and provides appropriate pagentation
  let messages = await GroupMessage.find({
    group_id: req.query.group_id
  })
    .sort({ time_sent: "ascending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    result: messages.length,
    data: messages
  });
});
