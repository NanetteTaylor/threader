require('dotenv').config();
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var Twit = require('twit');
var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
const twitterSignIn = require('twittersignin')({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});


//==== START OF API ====
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.post("/tweet", (req, res) => {
  console.log('Inside tweet');
  T.post('statuses/update', { status: req.body.status }, function(err, data, response) {
    console.log(`ERROR:${err}`);
    console.log(`RESPONSE:${response}`);
    res.status(200).send(data);
  })
});

router.post("/reply-tweet", (req, res) => {
  console.log('Inside reply tweet');
  T.post('statuses/update', { status: req.body.status, in_reply_to_status_id: req.body.replyID  }, function(err, data, response) {
    // console.log(`ERROR:${err}`);
    // console.log(`RESPONSE:${response}`);
    res.status(200).send(data);
  })
});

router.post("/redirect", async (req, res) => {
  console.log('Twitter redirect');
  const response = await twitterSignIn.getRequestToken({
    oauth_callback: "http://127.0.0.1:3000/",
    x_auth_access_type: "read",
  });
  console.log(response);
  const requestToken = response.oauth_token;
  const requestTokenSecret = response.oauth_token_secret;
  const callbackConfirmed = response.oauth_callback_confirmed;
  // if(callbackConfirmed){
  //   res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken}`, 302);
  // }
});

module.exports = router;