const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupMessageSchema = new Schema({
  group_id: {
    type: String,
    required: [true, "Error with group id"]
  },
  author: {
    type: String,
    required: [true, "No author given"]
  },
  message: {
    type: String,
    required: [true, "No message"]
  },
  time_sent: {
    type: Date,
    default: Date.now()
  },
  file_url: {
    type: String
  }
});

const GroupMessage = (module.exports = mongoose.model(
  "GroupMessage",
  GroupMessageSchema
));
