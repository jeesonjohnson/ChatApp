const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateChatSchema = new Schema({
    name: { type: String, required: true },
    user: { type: String, required: true }
});

const PrivateChat = module.exports  = mongoose.model("privatechats", PrivateChatSchema)