var jwt = require('jsonwebtoken');
var dotenv = require('dotenv').load();
var User = require('../models/User');

exports.isAuthenticated = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        res.status(401);
        return res.json({
          type: false,
          data: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401);
    return res.send({
      type: false,
      data: 'No token provided.'
    });
  }
}

exports.authenticate = function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401);
      res.json({
        type: false,
        data: 'Authentication failed. User not found.'
      });
    } else {
      // generate password hash
      var password = jwt.sign(req.body.password, process.env.SECRET);

      // check if password matches
      if (user.password != password) {
        res.status(401);
        res.json({
          type: false,
          data: 'Authentication failed. Wrong password.'
        });
      } else {
        // if user is found and password is right create a token
        var token = jwt.sign(user._id, process.env.SECRET, {
          expiresIn: 60 * 60 * 24 * 365 // expires in 1 year
        });
        res.json({
          type: true,
          token: token,
          user: user._id
        });
      }
    }
  });
}
