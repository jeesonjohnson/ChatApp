const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDoElementSchema = new Schema({
    collectionID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    assigned_users: { type: Array },
    progress_status: { type: Number, required: true },
    due_date: { type: Date }
});

const ToDoElement = module.exports  = mongoose.model("todoelements", ToDoElementSchema)