const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupMessageSchema = new Schema({
    group_id: { type: String, required: true },
    author: { type: String, required: true },
    message: { type: String, required: true },
    time_sent: { type: Date, required: true },
    file_url: { type: String }
});

const GroupMessage = module.exports  = mongoose.model("groupmessages", GroupMessageSchema)