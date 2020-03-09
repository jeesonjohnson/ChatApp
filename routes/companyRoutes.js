const express = require('express');
const companyController = require('./../controllers/companyController');

const router = express.Router();

router.route('/').get(companyController.getAllCompanies);

router.route('/:id').get(companyController.getCompany);



module.exports = router;