var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Beer = require('../models/Beer');
var fs = require('fs');

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

exports.upload = function(req, res) {
  if (authorization(res, req.headers.authorization)) {
    var beerName = req.body.beername;
    var temporario = req.files.file.path;
    var novo = './public/uploads/' + beerName;

    fs.rename(temporario, novo, function(err) {
      if (err) {
        res.status(500);
        res.json({
          type: false,
          data: "Error occured: " + err
        });
      } else {
        res.json({
          type: true,
          file: novo
        });
      }
    });
  }
}

exports.updateBeer = function(req, res) {
  if (authorization(res, req.headers.authorization)) {
    Beer.findByIdAndUpdate(new ObjectId(req.params.id), req.body, function(err, Beer) {
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
    var beerId = req.params.id;
    deleteImage(beerId);
    Beer.findByIdAndRemove(new Object(beerId), function(err, Beer) {
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

function deleteImage(beerId) {
  Beer.findById(new ObjectId(beerId), function(err, Beer) {
    if (!err) {
      if (Beer) {
        fs.unlink('./public/uploads/' + Beer.image);
      }
    }
  });
}

function slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}