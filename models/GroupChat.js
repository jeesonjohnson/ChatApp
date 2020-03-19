const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupChatSchema = new Schema({
  title: {
    type: String,
    default: "Untitled Group Chat"
  },
  workspaceID: {
    type: Object,
    required: [true, "A groupchat must be associated to workspace"]
  },
  users: {
    type: Array,
    required: [true, "No users were added"]
  }
});

const GroupChat = (module.exports = mongoose.model(
  "GroupChat",
  GroupChatSchema
));
