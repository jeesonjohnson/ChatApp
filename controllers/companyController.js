const company = require("./../models/Company");
const catchAsync = require("./../utils/catchAsync");

exports.getAllCompanies = catchAsync(async (req, res) => {
  const companies = await company.find();

  res.status(200).json({
    status: "success",
    results: companies.length,
    data: companies
  });
});

// Finds details about a given company, provided the company id is given
exports.getCompany = catchAsync(async (req, res) => {
  const companyData = await company.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      companyData
    }
  });
});

//Gets all associated companies that are associated with a given user
exports.getAllUserCompanies = catchAsync(async (req, res) => {
  var companies = [];
  for (var x = 0; x < req.user.companies.length; x++) {
    companies.push(await company.findById(req.user.companies[x]));
  }
  res.status(200).json({
    status: "success",
    data: companies
  });
});
