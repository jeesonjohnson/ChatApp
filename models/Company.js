const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    name: { type: String, required: true },
    avatar: { type: String },
    admins: { type: Array, required: true },
    users: { type: Array },
    workspaces: { type: Array }
});

const Company = module.exports  = mongoose.model("companies", CompanySchema)