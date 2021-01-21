const mongoose = require("mongoose");

const GoogleDB = mongoose.model(
  "GoogleDB",
  new mongoose.Schema({
    user_token: String,  
    google_access_token: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = GoogleDB;