const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "No name given for user"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false
  },
  password_confirm: {
    type: String,
    required: [true, "Please confirm your pasword"],
    validate: {
      //NOTE: Works only on create or save
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords do not match!"
    }
  },
  companies: {
    type: Array,
    required: true
  },
  avatar: {
    type: String
  },
  admin: {
    type: Boolean,
    required: true
  }
});

//Password encryption
UserSchema.pre("save", async function(next) {
  //Runs function if password was modified
  if (!this.isModified("password")) return next();

  //Hash password
  this.password = await bcrypt.hash(this.password, 10);

  //Delete password_confirm field
  this.password_confirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = (module.exports = mongoose.model("User", UserSchema));
