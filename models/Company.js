const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: {
    type: String,
    required: [true, "No name given to company"],
    unique: true
  },
  avatar: {
    type: String
  },
  admins: {
    type: Array,
    required: [true, "No admins were added"]
  },
  users: {
    type: Array
  },
  workspaces: {
    type: Array
  }
});

const Company = (module.exports = mongoose.model("Company", CompanySchema));
