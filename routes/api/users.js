const express = require("express");
const User = require("../../models/user");
const router = express.Router();
const gravatar = require("gravatar");
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const bcrypt = require('bcryptjs')

router.get("/test", (req, res) =>
  res.json({
    msg: "Users api works"
  })
);

// @route   POST api/users/register
// @desc    Register user
// @access  public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: "Email already exists"
        });
      } else {
        const avatar = gravatar.url(req.body.email, {
          //size
          s: "200",
          //rating
          r: "pg",
          //default for size
          d: "mm"
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          // deconstruct, since would otherwise be avatar: avatar
          avatar
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });

      }
    })
    .catch();
});

// @route   POST api/users/login
// @desc    login user / Returning JWT token
// @access  public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email 
  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(404).json({email: 'User not found'});
      }

      //Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //create payload
            const payload = {id: user.id, name: user.name, avatar: user.avatar};

            // sign token
            jwt.sign(
              payload, 
              keys.secretOrKey, 
              //when should expire
              {expiresIn: 3600}, (err, token) => {
                return res.json({
                  token: 'Bearer ' + token
                })
              });
          } else {
            return res.status(400).json({password: 'Password incorrect!'})
          }
        })
    })
    .catch(err => console.log(err))
})

module.exports = router;
