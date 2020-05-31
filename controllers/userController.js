const user = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const bcrypt = require("bcryptjs");

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
  
  const foundUser = await user.findById(req.user._id);
  res.status(200).json({
    status: "success",
    data: foundUser
  });
});

exports.isUserLoggedIn = catchAsync(async (req, res, next) => {
  //
  var user = ""
  if(req.headers.cookie !== "" || req.headers.cookie != null){
    
    next();
  }
  else {
    return false
  }
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const {email, current_password, new_password} = req.body
  const checkUser = await user.findOne({email}).select("+password");

  if(!checkUser || !(await checkUser.correctPassword(current_password, checkUser.password))) {
    return next(new AppError("Credentials provided for the account is invalid", 401));
  }

  const changePass = {password: await bcrypt.hash(new_password, 10)}
  await user.findByIdAndUpdate(req.user.id, changePass, { new: true });
  res.status(201).json({
    status: "success",
    data: req.user
  });
});


exports.addCompany = catchAsync(async (req, res, next) => {
  var companyDetails = await company.findById(req.query.company_id);
  await user.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.status(201).json({
    status: "success",
    data: req.user
  });
});
