const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email already exists, please login',
          url: 'http://localhost:3000/user/login',
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        newUser
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'User successfully created',
              createdUser: {
                _id: result._id,
                email: result.email,
                password: 'encrypted',
              },
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      });
    });
});

module.exports = router;
