const user = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");

//This method should be altered such that it becomes for only a given workspace...
exports.getAllUsers = catchAsync(async (req, res) => {
  try {
    const users = await user.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
});

exports.getUser = catchAsync(async (req, res) => {
  try {
    const user = await user.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
});

exports.updateUser = catchAsync(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.id, req.body, { new: true });
  } catch (err) {
    await User.deleteOne(newUser);
    res.status(500).json({
      status: "error",
      err,
      message: "Update was not succesfull"
    });
  }
  res.status(201).json({
    status: "success"
  });
});
