const { user } = require("../models");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};


exports.getUsers = (req, res) => {
  user.find()
    .sort({ name: -1 })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error Occured",
      });
    });
}

exports.UpdateUser = (req, res) => {
  
  user.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      if (!req.body.email || !req.body.username) {
        res.status(400).send({
          message: "required fields cannot be empty",
        }); 
        
      }
      else if (!user) {
        return res.status(404).send({
          message: "no user found",
        });
      }
      else { res.status(200).send(user);}
    })
    .catch((err) => {
      return res.status(404).send({
        message: "error while updating the post",
      });
    });
}

exports.deleteUser = (req, res) => {
  user.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found ",
        });
      }
      res.send({ message: "User deleted successfully!" });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Could not delete user ",
      });
    });
}

exports.getUserById = (req, res) => {
  user.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.id,
        });
      }
      res.status(200).send(user);
     // console.log(user);
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.id,
      });
    });


}
