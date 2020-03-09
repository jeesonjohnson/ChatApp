const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupChatSchema = new Schema({
  name: {
    type: String,
    required: [true, "No name given for groupchat"],
    unqiue: true
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
