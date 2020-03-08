const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDoCollectionSchema = new Schema({
    workspaceID: { 
        type: String, 
        required: [ true, 'Error with workspace ID'] 
    },
    title: { 
        type: String, 
        required: [ true, 'No title given for workspace title'] 
    },
    to_do_elements: { 
        type: Array 
    }
});

const ToDoCollection = module.exports  = mongoose.model("ToDoCollection", ToDoCollectionSchema)