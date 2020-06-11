const Announcement = require("./../models/Announcement");
const Company = require("./../models/Company");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// //Gets all associated companies that are associated with a given user
// exports.getAllUserCompanies = catchAsync(async (req, res, next) => {
//     var companies = [];
//     for (var x = 0; x < req.user.companies.length; x++) {
//       companies.push(await company.findById(req.user.companies[x]));
//     }
//     res.status(200).json({
//       status: "success",
//       data: companies
//     });
//   });

// exports.createWorkspace = catchAsync(async (req, res, next) => {
//     var companyDetails = await Company.findById(req.body.company);
//     //Only an admin should be able to create a workspace
//     if (!companyDetails.admins.includes(req.user.id)) {
//       return next(
//         new AppError(
//           "You are not an admin to this company. You have no right to create a workspace",
//           401
//         )
//       );
//     }
//     //So that if the owner of a company creates the workspace their id is not repeated...
//     var compAdmins = [req.user.id];
//     var compUsers = [req.user.id];
//     if (companyDetails.ownerID != req.user.id) {
//       compAdmins.push(companyDetails.ownerID);
//       compUsers.push(companyDetails.ownerID);
//     }
//     var newWorkspace = await Workspace.create({
//       name: req.body.name,
//       admins: compAdmins,
//       users: compUsers
//     });
//     companyDetails.workspaces.push(newWorkspace.id);
//     await Company.findByIdAndUpdate(companyDetails.id, companyDetails, {
//       new: true
//     });
//     res.status(200).json({
//       status: "success",
//       data: newWorkspace
//     });
//   });

exports.getMessages = catchAsync(async (req, res, next) => {
    var events = await Announcement.find({"company_id": req.query.company_id}).sort({"time":-1})

    res.status(200).json({
        status: "success",
        data: events
    })
});

exports.addMessage = catchAsync(async (req,res, next) => {
    var eventDetails = await Announcement.create({
        company_id: req.body.company_id,
          user: req.body.user,
          isOwner: req.body.isOwner,
          isAdmin: req.body.isAdmin,
          time: req.body.time,
          content: req.body.content
    })

    var events = await Announcement.find({"company_id": req.body.company_id}).sort({"time":-1})

    console.log(events)

    res.status(200).json({
        status: "success",
        data: events
    })        
});

exports.deleteMessage = catchAsync(async (req,res, next) => {
    await Announcement.findByIdAndDelete(req.params.id)

    var events = await Announcement.find({"company_id": req.query.company_id}).sort({"time":-1})

    res.status(200).json({
        status: "success",
        data: events
    })
});