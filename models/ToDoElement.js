const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDoElementSchema = new Schema({
  collectionID: {
    type: Object,
    required:[true,"A collection ID Is needed"]
  },
  title: {
    type: String,
    default: "Untitled"
  },
  description: {
    type: String,
    default:""
  },
  assigned_users: {
    type: Array,
    default:[]
  },
  progress_status: {
    type: Number,
    default:0
  },
  due_date: {
    type: Date
  },
  creation_date:{
      type:Date,
      default:Date.now()
  }
});

const ToDoElement = (module.exports = mongoose.model(
  "ToDoElement",
  ToDoElementSchema
));
