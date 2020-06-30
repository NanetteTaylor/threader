require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const db = require("./model/helper");

var apiRouter = require('./routes/api');

const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.use(new TwitterStrategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:5000/twitter-callback",
},
function(token, tokenSecret, profile, cb) {
  // console.log(`Username is ${profile.displayName}`);
  // console.log(`Profile Image is ${profile._json.profile_image_url_https}`);
  // console.log(`Handle is ${profile._json.screen_name}`);
  // console.log(`Description is ${profile._json.description}`);
  // console.log(`Followers is ${profile._json.followers_count}`);
  // console.log(`Following is ${profile._json.friends_count}`);
  db(`UPDATE access_keys SET token = '${token}', token_secret = '${tokenSecret}', username = '${profile.displayName}', handle = '${profile._json.screen_name}', user_description = '${profile._json.description}', followers= '${profile._json.followers_count}', friends= '${profile._json.friends_count}', profile_image= '${profile._json.profile_image_url_https}' WHERE id=1;`)
    .then(results => {
      console.log(results.data);
    })
    .catch(err => console.log(err));
  return cb(null, profile);
}
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(passport.initialize());
app.use(passport.session());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get("/", function(req, res, next) {
  res.send("Access the API at path /api");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/login', function (req, res) {
  res.render('login');
});

// app.get("/",passport.authenticate('twitter'));

app.use("/api", apiRouter);

app.get('/twitter-login',passport.authenticate('twitter'));

app.get('/twitter-callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://127.0.0.1:3000/');
    // console.log(req);
    // console.log(req.session);
    // res.send("You're logged in");
    // res.redirect('http://127.0.0.1:3000/');
  });

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.send('error');
  res.send(err.message);
});

module.exports = app;
