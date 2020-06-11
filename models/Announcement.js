const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  company_id: {
    type: Object,
    required:[true,"A company id is needed"]
    },
  user: {
    type: String,
    required: [true, "Error with user name"]
  },
  isOwner:{
    type:Boolean,
  },
  isAdmin: {
    type: Boolean,
  },
  time: {
    type: Date,
    default: Date.now()
  },
  content: {
    type: String
  },
});

const Announcement = (module.exports = mongoose.model(
  "Announcement",
  AnnouncementSchema
));
