const controller = require("../controllers/spotify.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get('/api/spotify/auth', controller.authenticate);
  app.get('/api/spotify/callback', controller.callback);
  app.get("/api/spotify/user-data",controller.retrieveUserData);
  app.get("/api/spotify/create-playlist",controller.createSpotifyPlaylist);
  app.get("/api/spotify/add-items-to-playlist",controller.addItemsToPlaylist);
};