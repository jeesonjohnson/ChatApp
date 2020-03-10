const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const userSchema = new Schema({
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
    // select: false,
    validate: {
      //NOTE: Works only on create or save
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords do not match!"
    }
  },
  passwordChangedAt: Date,
  companies: {
    type: Array
    // default: []
  },
  avatar: {
    type: String,
    default: "This defualt avatar link neds to be changed"
  },
  owner: {
    type: Boolean,
    default: false
  }
});

//Password encryption using bcrypt hashing
userSchema.pre("save", async function(next) {
  //Runs function if password was modified
  if (!this.isModified("password")) return next();

  //Hash password
  this.password = await bcrypt.hash(this.password, 10);

  //Delete password_confirm field
  this.password_confirm = undefined;

  
  next();
});

//Assigns ability if the user password has been changed recently to reset token
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Checks if the encrypted password is the correct password/
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Checks if the user password has been changed, and appropriate function if so
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


const User = (module.exports = mongoose.model("User", userSchema));
