const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDoCollectionSchema = new Schema({
    workspaceID: { type: String, required: true },
    title: { type: String, required: true },
    to_do_elements: { type: Array }
});

const ToDoCollection = module.exports  = mongoose.model("todocollections", ToDoCollectionSchema)