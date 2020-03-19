const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const Company = require("./../models/Company");
const PrivateChat = require("./../models/PrivateChat");
const PrivateMessage = require("./../models/PrivateMessage");
const AppError = require("./../utils/appError");

//SHould be deleted on production
exports.getAllMessages = catchAsync(async (req, res, next) => {
  const privateMessage = await PrivateMessage.find();
  res.status(200).json({
    status: "success",
    results: privateMessage.length,
    data: privateMessage
  });
});

// ################## Create a private message ###################
exports.createAPrivateMessage = catchAsync(async (req, res, next) => {
  var privateChat = await PrivateChat.findById(req.body.private_id);
  if (privateChat.user1 != req.user.id && privateChat.user2 != req.user.id) {
    return next(
      new AppError(
        "You are not a member of this chat, you have no right to send messages",
        401
      )
    );
  }
  //Actual create a private message.
  var newPrivateMessage = await PrivateMessage.create({
    private_id: privateChat.id,
    author: req.user.id,
    message: req.body.message,
    time_sent: Date.now(),
    file_url: req.body.file_url
  });

  res.status(200).json({
    status: "success",
    data: newPrivateMessage
  });
});

// ################ Return a given private message #################
exports.getAPrivateMessage = catchAsync(async (req, res, next) => {
  var messageDetails = await PrivateMessage.findById(req.query.message_id);
  res.status(200).json({
    status: "success",
    data: messageDetails
  });
});

// ###################### Get all messages in a given group chat ###################
exports.getAllMessagesInPrivateChat = catchAsync(async (req, res, next) => {
  //Below code is for pagentation of methods
  const page = req.query.page * 1 || 1; //Ensures javascript parses the number correctly
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  // Gets all appropriate messages, and sorts them such to be descending based creation, and provides appropriate pagentation
  let messages = await PrivateMessage.find({
    private_id: req.query.private_id
  })
    .sort({ time_sent: "descending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    result: messages.length,
    data: messages
  });
});
