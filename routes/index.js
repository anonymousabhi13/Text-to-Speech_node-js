var express = require("express");
const router = express.Router();
const UserModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const PostSchema = require("./post");

const Say = require("say");
passport.use(new localStrategy(UserModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/home", function (req, res, next) {
  res.render("Home");
});

router.get("/register", function (req, res, next) {
  res.render("Register");
});
router.get("/login", function (req, res, next) {
  res.render("Login");
});

// router.get("/create", function (req, res) {
//   res.render("create");
// });

router.post("/create", isLoggedIn, function (req, res) {
  UserModel.findOne({ username: req.session.passport.user }).then(function (
    loginuser
  ) {
    PostSchema.create({
      title: req.body.title,
      description: req.body.description,
      userid: loginuser._id,
    })
      .then(function (pwu) {
        Say.speak(pwu.title, 1.0);

        loginuser.mypost.push(pwu._id);
        loginuser.save();
      })
      .then(function (val) {
        res.redirect("/Home");
      });
  });
});

router.post("/register", function (req, res) {
  const newUser = new UserModel({
    name: req.body.name,
    username: req.body.username,
  });
  UserModel.register(newUser, req.body.password)
    .then(function (createdUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/Home");
      });
    })
    .catch(function (err) {
      res.send(err);
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/Login");
  }
}

// function check(req, res,next) {
//   if (!req.isAuthenticated()) {
//     return next();
//   }
//   else {
//     res.redirect('/home');
//   }
// }

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/Home",
    failureRedirect: "/Login",
  }),
  function (req, res, next) {}
);

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/Login");
});
module.exports = router;
