const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { getUserById } = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/login/user", [authJwt.verifyToken], controller.userBoard);

  // app.get("/api/login/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard);

  app.get("/api/login/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard);

  app.get("/api/login/all", controller.allAccess);
  app.get("/api/login/allUsers", controller.getUsers);
  app.get("/api/login/allUsers/:id", controller.getUserById);
  app.delete("/api/login/allUsers/:id", controller.deleteUser);
  app.patch("/api/login/allUsers/:id", controller.UpdateUser);



};
