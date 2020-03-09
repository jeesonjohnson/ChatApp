const User = require("./../models/User");
const company = require("./../models/Company");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https"
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //Create new user
  if (req.body.password != req.body.password_confirm) {
    res.status(500).json({
      status: "error",
      message: "Password and password confirmation do not match"
    });
  }
  if (req.body.password.length < 8) {
    res.status(500).json({
      status: "error",
      message: "Password must at least be 8 characters"
    });
  }
  var newUser;
  try {
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password_confirm: req.body.password_confirm,
      avatar: req.body.avatar,
      companies: req.body.companies,
      admin: req.body.admin
    });
  } catch (_) {
    res.status(500).json({
      status: "error",
      message: "Email is already registered to a user account"
    });
  }

  var newCompany = [];
  if (newUser.admin) {
    //Implemented associated validation to the creation of a user account.
    try {
      newCompany = await company.create({
        name: req.body.company_name,
        avatar: req.body.company_avatar,
        admins: [newUser.id],
        users: [newUser.id],
        owner: newUser.id,
        workspaces: req.body.company_workspaces
      });
      //Updates the user details of the newly created element
      User.findOneAndUpdate(
        { id: newUser.id },
        { companies: [newCompany.id] },
        { upsert: true }
      );
      newUser.companies = [newCompany.id];
      // Creation in company, must be attributed to company name already taken
    } catch (err) {
      await User.deleteOne(newUser);
      res.status(500).json({
        status: "error",
        err,
        message: "Company name is already taken"
      });
    }
  }

  //Create web token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
      company: newCompany
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});
