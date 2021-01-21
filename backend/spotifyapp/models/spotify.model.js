const mongoose = require("mongoose");

const SpotifyDB = mongoose.model(
  "SpotifyDB",
  new mongoose.Schema({
    user_token: String,  
    spotify_access_token: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = SpotifyDB;