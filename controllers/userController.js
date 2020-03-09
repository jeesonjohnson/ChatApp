const user = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");

//This method should be altered such that it becomes for only a given workspace...
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await user.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const foundUser = await user.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: foundUser
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json({
    status: "success"
  });
});
