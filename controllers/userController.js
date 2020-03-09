const user = require('./../models/User');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await user.find();
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res) => {
    const user = await user.findById();

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
