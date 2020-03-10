const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDoCollectionSchema = new Schema({
  workspaceID: {
    type: String,
    required: [true, "Error with collection ID"]
  },
  title: {
    type: String,
    default: "Untitled"
  },
  to_do_elements: {
    type: Array
  }
});

const ToDoCollection = (module.exports = mongoose.model(
  "ToDoCollection",
  ToDoCollectionSchema
));
