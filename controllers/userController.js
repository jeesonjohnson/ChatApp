const user = require("../models/User");
const Company = require("../models/Company");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");

exports.getUser = catchAsync(async (req, res, next) => {
  const foundUser = await user.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: foundUser
  });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => { 
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

//+++++++++++++++++++ ADD THIS ++++++++++++++++++++++++++//
  if(email != req.user.email) {
    return next(new AppError("Credentials are associated with another account", 401));
  }
//+++++++++++++++++++ UP TO HERE  +++++++++++++++++++++++// 

  const changePass = {password: await bcrypt.hash(new_password, 10)}

  await user.findByIdAndUpdate(req.user.id, changePass, { new: true });
  res.status(201).json({
    status: "success",
    data: req.user
  });
});

exports.addCompany = catchAsync(async (req, res, next) => {
  var companyDetails = await Company.findById(req.query.company_id);
  await user.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.status(201).json({
    status: "success",
    data: req.user
  });
});

exports.getUsersByName = catchAsync(async (req, res, next) => {
  let regexName = new RegExp(req.query.name) 
  
  const foundUsers = await user.find({'name': regexName, '_id': {$nin:req.query.users}}, {'_id':1, 'name':1, 'email':1} )

  res.status(200).json({
    status: "success",
    data: foundUsers
  })
});