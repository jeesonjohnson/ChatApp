const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkspaceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  admin: {
    type: String,
    required: true
  },
  users: {
    type: Array
  },
  task_collections: {
    type: Array
  },
  group_chats: {
    type: Array,
    required: true
  },
  private_chats: {
    type: Array
  }
});

const Workspace = (module.exports = mongoose.model(
  "Workspace",
  WorkspaceSchema
));
