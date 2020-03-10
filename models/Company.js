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
    default: []
  },
  ownerID: {
    type: Object,
    required: [true, "A company must have an owner"]
  },
  users: {
    type: Array,
    default: []
  },
  workspaces: {
    type: Array,
    default: []
  }
});

const Company = (module.exports = mongoose.model("Company", CompanySchema));
