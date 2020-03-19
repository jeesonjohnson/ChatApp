const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateChatSchema = new Schema({
  user1: {
    type: String,
    required: [true, "No reciever id given for private chat"]
  },
  user2: {
    type: String,
    required: [true, "No reciever id given for private chat"]
  },
  workspaceID: {
    type: Object,
    required: [true, "A groupchat must be associated to workspace"]
  },
});

const PrivateChat = (module.exports = mongoose.model(
  "PrivateChat",
  PrivateChatSchema
));
