var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv').load();

exports.findById = function(req, res) {
  User.findById(new ObjectId(req.params.id), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        res.json({
          type: true,
          data: user
        });
      } else {
        res.status(404);
        res.json({
          type: false,
          data: "User: " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.findAll = function(req, res) {
  User.find({}, function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        res.json({
          type: true,
          data: user
        });
      } else {
        res.status(404);
        res.json({
          type: false,
          data: "Users: not found"
        });
      }
    }
  });
}

exports.addUser = function(req, res) {
  var newUser = new User(req.body);

  // generate password hash
  var password = jwt.sign(newUser.password, process.env.SECRET);
  newUser.password = password;

  // valid user
  if (!newUser.name || !newUser.email || !newUser.password) {
    res.status(500);
    return res.json({
      type: false,
      data: 'Please enter name, email and password.'
    });
  }

  newUser.save(function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Duplicate email: " + err
      });
    } else {
      res.json({
        type: true,
        data: user
      });
    }
  });
}

exports.updateUser = function(req, res) {
  var editUser = new User(req.body);

  // valid user
  if (!editUser.name || !editUser.email || !editUser.password) {
    res.status(500);
    return res.json({
      success: false,
      message: 'Please enter name, email and password.'
    });
  }

  User.findByIdAndUpdate(new ObjectId(req.params.id), editUser, function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        res.json({
          type: true,
          data: user
        });
      } else {
        res.status(404);
        res.json({
          type: false,
          data: "User: " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.deleteUser = function(req, res) {
  User.findByIdAndRemove(new Object(req.params.id), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      res.json({
        type: true,
        data: "User: " + req.params.id + " deleted successfully"
      });
    }
  });
}