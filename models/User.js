const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    companies: { type: Array, required: true},
    avatar: { type: String, required: true}
});

const User = module.exports  = mongoose.model("users", UserSchema)