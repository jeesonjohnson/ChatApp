const company = require("./../models/Company");
const user = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Finds details about a given company, provided the company id is given
exports.getCompany = catchAsync(async (req, res, next) => {
  const companyData = await company.findById(req.params.id);
  
  res.status(200).json({
    status: "success",
    data: {
      companyData
    }
  });
});

//Gets all associated companies that are associated with a given user
exports.getAllUserCompanies = catchAsync(async (req, res, next) => {
  var companies = [];
  for (var x = 0; x < req.user.companies.length; x++) {
    companies.push(await company.findById(req.user.companies[x]));
  }
  res.status(200).json({
    status: "success",
    data: companies
  });
});

//Delete a given user form  a company provided the company id and user id
exports.deleteUserFromCompany = catchAsync(async (req, res, next) => {
  var companyDetails = await company.findById(req.query.company_id);
  //If the currently loggeed in user is an admin, we can access the current user details
  //Since we are validating the user details with the current middleware. so req.user.id is currently logged in user
  if (!companyDetails.admins.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not an admin to this company. You have no right to remove users",
        401
      )
    );
  }
  var userToDel = await user.findById(req.query.user_id);
  // Login in User is admin, but not owner, then they cant delete an admin
  if (!req.user.owner && companyDetails.admins.includes(req.user.id)) {
    return next(
      new AppError(
        "You are not the company owner, you cannot delete admins",
        401
      )
    );
  }

  for(var x in companyDetails.admins){
    if(companyDetails.admins[x] === userToDel.id){
      companyDetails.admins.splice(x,1);
      break;
    }
  }

  //Now to remove the user from company details.
  for (var x = 0; x < companyDetails.users.length; x++) {
    if (companyDetails.users[x] === userToDel.id) {
      companyDetails.users.splice(x, 1);
      break;
    }
  }
  //Now to remove the company id from user data
  for (var x = 0; x < userToDel.companies.length; x++) {
    if (userToDel.companies[x] === companyDetails.id) {
      userToDel.companies.splice(x, 1);
      break;
    }
  }
  await user.findByIdAndUpdate(userToDel.id, userToDel, { new: true });
  await company.findByIdAndUpdate(companyDetails.id, companyDetails, {
    new: true
  });
  res.status(200).json({
    status: "success",
    data: {
      user: userToDel,
      company: companyDetails
    }
  });
});


exports.addUserToCompany = catchAsync(async (req, res, next) => {
  var companyDetails = await company.findById(req.body.company_id);
  
  if(req.body.admin){
    companyDetails.admins.push(req.params.id)
  }
  companyDetails.users.push(req.params.id)

  let newUser = await user.findById(req.params.id)

  newUser.companies.push(req.body.company_id)

  await company.findByIdAndUpdate(req.body.company_id, companyDetails, { new: true });
  await user.findByIdAndUpdate(req.params.id, newUser, { new: true })
  
  res.status(200).json({
    status: "success",
  });
});

exports.editCompanyName = catchAsync(async (req, res, next) => {
  var companyDetails = await company.findById(req.params.id)

  companyDetails.name = req.body.params.newName
  
  var newCompanyDetails = await company.findByIdAndUpdate(req.params.id, companyDetails)

  res.status(200).json({
    status: "success",
    data: {
      companyDetails: newCompanyDetails
    }
  })
});