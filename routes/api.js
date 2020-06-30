require('dotenv').config();
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

//==== START OF API ====
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.post("/tweet", async (req, res) => {
  console.log('Inside tweet');
  var access_key = "";
  var access_token_secret = "";
  await db("SELECT * FROM access_keys;")
    .then(results => {
      access_key = results.data[0].token;
      access_token_secret = results.data[0].token_secret
      console.log(access_key);
      console.log(access_token_secret);
    })
    .catch(err => console.log(err));

  var Twit = require('twit');
  var twitterOauth = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: access_key,
    access_token_secret: access_token_secret
  });

  twitterOauth.post('statuses/update', { status: req.body.status, in_reply_to_status_id: req.body.replyID  }, function(err, data, response) {
    // console.log(`ERROR:${err}`);
    // console.log(`RESPONSE:${response}`);
    res.status(200).send(data);
  })
});

router.get("/twitter-profile", async (req, res) => {
  db("SELECT username, handle, user_description, followers, friends, profile_image FROM access_keys;")
    .then(results => {
      res.status(200).send(results.data);
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;