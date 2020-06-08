const User = require("../models/User");
const company = require("../models/Company");
const crypto = require("crypto");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

// Methods for generating JWT tokens for the user sign in.
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("token", token, {
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

/*
  Method for registeration of a given user account, appropriate function if the user is as an admin as well. 
*/
exports.signup = catchAsync(async (req, res, next) => {
  //Create new user
  if (req.body.password != req.body.password_confirm) {
    return next(new AppError("The passwords do not match", 500));
  }
  if (req.body.password.length < 8) {
    return next(new AppError("Password must at least be 8 characters", 500));
  }
  var newUser;
  try {
    newUser = await User.create({
      avatar: req.body.avatar,
      companies: req.body.companies,
      owner: req.body.owner,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password_confirm: req.body.password_confirm
    });

  } catch (_) {
    return next(
      new AppError(
        "Email is already registered to an account or not valid",
        500
      )
    );
  }

  var newCompany = [];
  if (newUser.owner) {
    //Implemented associated validation to the creation of a user account.
    try {
      newCompany = await company.create({
        name: req.body.company_name,
        avatar: req.body.avatar,
        admins: [newUser.id],
        users: [newUser.id],
        ownerID: newUser.id,
        workspaces: req.body.newUser.company_workspaces
      });
      //Updates the user details of the newly created element
      await User.findByIdAndUpdate(
        newUser.id,
        { companies: [newCompany.id] },
        { new: true }
      );
      newUser.companies = [newCompany.id];
      // Creation in company, must be attributed to company name already taken
    } catch (err) {
      console.log(newUser);
      await User.deleteOne(newUser);
      return next(new AppError("Company name is already taken", 500));
    }
  }

  //Create web token
  const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
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
  const { email, password } = req.body.userData;

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

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('token')

  res.status(200).json({
    status: "success"
  })
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  const token = req.cookies.token
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    console.log(req.headers)
  //   token2 = req.headers.authorization.split(" ")[1];
  //   console.log("token2", token2)
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
