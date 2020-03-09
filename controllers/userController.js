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
