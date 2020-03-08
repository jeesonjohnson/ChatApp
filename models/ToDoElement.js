const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDoElementSchema = new Schema({
    collectionID: { 
        type: String 
    },
    title: { 
        type: String, 
        required: [ true, 'No title given for To Do element'] 
    },
    description: { 
        type: String 
    },
    assigned_users: { 
        type: Array 
    },
    progress_status: { 
        type: Number, 
        required: [ true, 'No progress status given for To Do element'] 
    },
    due_date: { 
        type: Date 
    }
});

const ToDoElement = module.exports  = mongoose.model("ToDoElement", ToDoElementSchema)