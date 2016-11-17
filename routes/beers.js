var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Beer = require('../models/Beer');

exports.findById = function(req, res) {
  Beer.findById(new ObjectId(req.params.id), function(err, Beer) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (Beer) {
        res.json({
          type: true,
          data: Beer
        });
      } else {
        res.json({
          type: false,
          data: "Beer: " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.findAll = function(req, res) {
  Beer.find({}, function(err, Beer) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (Beer) {
        res.json({
          type: true,
          data: Beer
        });
      } else {
        res.json({
          type: false,
          data: "Beer: " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.addBeer = function(req, res) {
  if (authorization(res, req.headers.authorization)) {
    var BeerModel = new Beer(req.body);
    BeerModel.save(function(err, Beer) {
      if (err) {
        res.status(500);
        res.json({
          type: false,
          data: "Error occured: " + err
        });
      } else {
        res.json({
          type: true,
          data: Beer
        });
      }
    });
  }
}

exports.updateBeer = function(req, res) {
  if (authorization(res, req.headers.authorization)) {
    var updatedBeerModel = new Beer(req.body);
    console.log(updatedBeerModel);
    Beer.findByIdAndUpdate(new ObjectId(req.params.id), updatedBeerModel, function(err, Beer) {
      if (err) {
        res.status(500);
        res.json({
          type: false,
          data: "Error occured: " + err
        });
      } else {
        if (Beer) {
          res.json({
            type: true,
            data: Beer
          });
        } else {
          res.json({
            type: false,
            data: "Beer: " + req.params.id + " not found"
          });
        }
      }
    });
  }
}

exports.deleteBeer = function(req, res) {
  if (authorization(res, req.headers.authorization)) {
    Beer.findByIdAndRemove(new Object(req.params.id), function(err, Beer) {
      if (err) {
        res.status(500);
        res.json({
          type: false,
          data: "Error occured: " + err
        });
      } else {
        res.json({
          type: true,
          data: "Beer: " + req.params.id + " deleted successfully"
        });
      }
    });
  }
}

function authorization(res, headersAuthorization) {
  var auth = new Buffer(process.env.AUTH_USER + ":" + process.env.AUTH_PASS).toString("base64");

  if (auth != headersAuthorization) {
    res.status(401);
    res.json({
      type: false,
      data: "Erro 401: UNAUTHORIZED ACCESS"
    });
    return false;
  }
  return true;
}