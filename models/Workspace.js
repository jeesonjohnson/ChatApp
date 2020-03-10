const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkspaceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  admins: {
    type: Array,
    default:[]
  },
  users: {
    type: Array,
    default:[]
  },
  task_collections: {
    type: Array,
    default:[]
  },
  group_chats: {
    type: Array,
    default:[]
  },
  private_chats: {
    type: Array,
    default:[]
  }
});

const Workspace = (module.exports = mongoose.model(
  "Workspace",
  WorkspaceSchema
));
