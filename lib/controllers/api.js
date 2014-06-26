'use strict';

var mongoose = require('mongoose'),
    Book = mongoose.model('Thing');

exports.getBooks = function (req, res) {
  return Book.find(function (err, books) {
    if (err) {
      res.send(err);
    }

    res.json(books);
  });
};

exports.createBook = function (req, res) {
  return Book.create({
      name: req.body.name,
      info: req.body.info
    },

    function (err, book) {
      if (err) {
        res.send(err);
      }

      Book.find(function (err, books) {
        if (err) {
          res.send(err);
        }

        res.json(books);
      });
    });
};

exports.getBook = function (req, res) {
  return Book.findById(req.params.id, function (err, book) {
    if (err) {
      res.send(err);
    }

    res.json(book);
  });
};

exports.updateBook = function (req, res) {
  var update = {};

  if (req.body.name) {
    update.name = req.body.name;
  }

  if (req.body.info) {
    update.info = req.body.info;
  }

  return Book.update({
      _id: req.params.id
    },

    {
      $set: update
    },

    {
      upsert: true
    },

    function (err, book) {
      if (err) res.send(err);

      Book.find(function (err, books) {
        if (err) res.send(err);

        res.json(books);
      });
    });
};

exports.deleteBook = function (req, res) {
  return Book.remove({
    _id: req.params.id
  }, function (err, book) {
    if (err) {
      res.send(err);
    }

    Book.find(function (err, books) {
      if (err) {
        res.send(err);
      }

      res.json(books);
    });
  });
};
