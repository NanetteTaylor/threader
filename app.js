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
const TwitterStrategy = require("passport-twitter").Strategy; // You need to select this to use it specifically for Twitter


//Creating the passport object
passport.use(new TwitterStrategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:5000/twitter-callback",
}, // This function below gets executed after authentication and twitter redirects to the callback URL
function(token, tokenSecret, profile, cb) {
    console.log(profile);
  // Save the user's profile details to the
    db(`SELECT * FROM users WHERE twitter_id = '${profile._json.id_str}';`)
        .then(results => {
            console.log(results);
            if(results.data.length < 1){
                db(`INSERT INTO users(token,token_secret,username,handle,user_description,followers,friends,profile_image,twitter_id) values('${token}','${tokenSecret}','${profile.displayName}','${profile._json.screen_name}','${profile._json.description}','${profile._json.followers_count}','${profile._json.friends_count}','${profile._json.profile_image_url_https}','${profile._json.id_str}'); SELECT * FROM users WHERE twitter_id='${profile._json.id_str}';`)
                    .then(result => {
                        console.log(`INSERTED Twitter data for ${profile._json.screen_name}`);
                        console.log(result.data);
                        return cb(null, result.data[1][0]);
                    })
                    .catch(err => console.log(err));
            } else {
                db(`UPDATE users SET token = '${token}', token_secret = '${tokenSecret}', username = '${profile.displayName}', handle = '${profile._json.screen_name}', user_description = '${profile._json.description}', followers= '${profile._json.followers_count}', friends= '${profile._json.friends_count}', profile_image= '${profile._json.profile_image_url_https}' WHERE twitter_id='${results.data[0].twitter_id}'; SELECT * FROM users WHERE twitter_id = '${profile._json.id_str}';`)
                    .then(result => {
                        console.log(`UPDATED Twitter data for ${profile._json.screen_name}`);
                        console.log(result.data);
                        return cb(null, result.data[1][0]);
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
}
));
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db(`SELECT * FROM users WHERE id=${id}`)
        .then(results => {
            return cb(null, results.data[0]);
        })
        .catch(err => {
            console.log(err);
        });
});

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res, next) {
  // res.send("Access the API at path /api");
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//Renders the login page
// app.get('/login', function (req, res) {
//   res.render('login');
// });
//twitter logout
app.get('/logout', (req, res) => {
    //handle with passport
    req.logout();
    req.session.notice = "Has been successfully been logged out!";
    res.redirect('http://127.0.0.1:3000/main');
});

app.use("/api", apiRouter);

// This initiates the OAuth process and redirects a user to twitter's authentication page
app.get('/twitter-login',passport.authenticate('twitter'));

// This route is for the callack URL. Twitter redirects the user to this route when authentication is successful.
app.get('/twitter-callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Redirects the user to the link below. The link is for the React page of the app
    res.cookie('uid', `${req.user.id}`, {maxAge: 7200000});
    res.redirect('/main');
  });

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
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
