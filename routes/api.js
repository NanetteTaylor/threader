require('dotenv').config();
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
  // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  // strictSSL:            true,     // optional - requires SSL certificates to be valid.
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
    console.log(`ERROR:${err}`);
    console.log(`RESPONSE:${response}`);
    res.status(200).send(data);
  })
});

module.exports = router;