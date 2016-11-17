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

exports.updateBeer = function(req, res) {
  var updatedBeerModel = new Beer(req.body);
  console.log(req.body);
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

exports.deleteBeer = function(req, res) {
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