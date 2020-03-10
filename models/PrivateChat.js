const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateChatSchema = new Schema({
  user: {
    type: String,
    required: [true, "No reciever id given for private chat"]
  }
});

const PrivateChat = (module.exports = mongoose.model(
  "PrivateChat",
  PrivateChatSchema
));
