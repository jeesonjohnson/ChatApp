const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateMessageSchema = new Schema({
  private_id: {
    type: String,
    required: [true, "No id given for private message"]
  },
  author: {
    type: String,
    required: [true, "No author given for private message"]
  },
  author_id:{
    type:String,
  },
  message: {
    type: String,
    required: [true, "No message given for private message"]
  },
  time_sent: {
    type: Date,
    default:Date.now()
  },
  file_url: {
    type: String
  }
});

const PrivateMessage = (module.exports = mongoose.model(
  "PrivateMessage",
  PrivateMessageSchema
));
