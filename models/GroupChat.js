const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupChatSchema = new Schema({
    name: { type: String, required: true, unqiue: true },
    users: { type: Array, required: true }
});

const GroupChat = module.exports  = mongoose.model("groupchats", GroupChatSchema)