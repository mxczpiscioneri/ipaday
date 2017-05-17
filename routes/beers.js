var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Beer = require('../models/Beer');
var fs = require('fs');
var AWS = require('aws-sdk');
var dotenv = require('dotenv');
dotenv.load();

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
          data: "Beers: not found"
        });
      }
    }
  });
}

exports.findYear = function(req, res) {
  Beer.find({
    year: req.params.year
  }, function(err, Beer) {
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
          data: "Beers: " + req.params.year + " not found"
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

exports.upload = function(req, res) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  fs.readFile(req.files.file.path, function(err, data) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      var base64data = new Buffer(data, 'binary');

      var s3 = new AWS.S3();
      s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: req.body.beername,
        Body: base64data,
        ACL: 'public-read'
      }, function(resp) {
        res.json({
          type: true,
          data: arguments
        });
      });
    }
  });
}

exports.updateBeer = function(req, res) {
  var BeerModel = new Beer(req.body);
  Beer.findByIdAndUpdate(new ObjectId(req.params.id), BeerModel, function(err, Beer) {
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
  var beerId = req.params.id;
  Beer.findByIdAndRemove(new Object(beerId), function(err, Beer) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      var s3 = new AWS.S3();

      var deleteParam = {
        Bucket: process.env.S3_BUCKET,
        Key: Beer.image
      };

      s3.deleteObject(deleteParam, function(err, data) {
        if (err) {
          res.status(500);
          res.json({
            type: false,
            data: "Error occured: " + err
          });
        } else {
          res.json({
            type: true,
            data: "Beer: " + beerId + " deleted successfully"
          });
        }
      });
    }
  });
}