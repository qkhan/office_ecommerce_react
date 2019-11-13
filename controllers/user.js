const User = require("../models/user");
const jwt  = require('jsonwebtoken'); // to generate signed token
const expressJWT  = require('express-jwt'); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
  console.log("req.body", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    //res.json( { message: "hello there"} );
    user.salt = undefined
    user.hashed_password = undefined
    res.json({
      user
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on Email
  const { email, password } = req.body;
  User.findOne( { email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
          err: "User with that email does not exist. Please signup"
      });
    }

    // if user is found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
          error: "Email and password don't match"
      });
    }
    // generate a signed token with user_id and secret
    const token = jwt.sign( {_id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    let { _id, name, email, role } = user;
    return res.json( { token, user: { _id, email, name, role } } );
  });
};


exports.signout = (req, res) => {
  console.log("req.body", req.body);
  res.clearCookie("t");
  res.json( { message: "Signout success "});
};


exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied"
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource! Access denied"
    });
  }
  next();
};
