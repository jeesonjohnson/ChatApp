const company = require('./../models/Company');
const catchAsync = require('./../utils/catchAsync');

exports.getAllCompanies = catchAsync(async (req, res) => {
    const companies = await company.find();
    
    res.status(200).json({
        status: 'success',
        results: companies.length,
        data: {
            companies
        }
    });
});

exports.getCompany = catchAsync(async (req, res) => {
    const company = await company.findById();

    res.status(200).json({
        status: 'success',
        data: {
            company
        }
    });
});