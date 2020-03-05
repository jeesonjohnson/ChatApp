const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateMessageSchema = new Schema({
    private_id: { type: String, required: true },
    author: { type: String, required: true },
    message: { type: String, required: true },
    time_sent: { type: Date, required: true },
    file_url: { type: String }
});

const PrivateMessage = module.exports  = mongoose.model("privatemessages", PrivateMessageSchema)