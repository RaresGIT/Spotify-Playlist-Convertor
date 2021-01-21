const controller = require("../controllers/google.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get('/api/google/auth', controller.authenticate);
  app.get('/api/google/callback', controller.callback);
  app.get("/api/google/playlist-data",controller.getAllPlaylists);
  app.get("/api/google/all-playlist-videos",controller.getAllPlaylistVideos);
};
