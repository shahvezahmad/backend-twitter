const moment = require("moment");
const Tweet = require("../Models/tweetModel");
const User = require("../Models/userModel");

const feed = async (req, res) => {
    const info = req.body;
    const tweetInfo = JSON.parse(req.body.tweet);
  
    newTweet = Tweet.create(
      {
        content: tweetInfo.content,
        retweets: [],
        postedTweetTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      },
      (err, newTweet) => {
        if (!err) {
          if (info.image) {
            newTweet.image = info.image;
          } else console.log("no image found");
          User.findOne({ username: tweetInfo.postedBy.username }, (err, doc) => {
            if (!err) {
              newTweet.postedBy = doc._id;
              if (newTweet.postedBy) {
                newTweet.save();
                doc.tweets.unshift(newTweet._id);
                doc.save();
                return res.json({ image: info.image });
              } else
                return res.json({ status: "error", error: "An error occured" });
            } else
              return res.json({ status: "error", error: "An error occured" });
          });
        }
      }
    );
};

module.exports = {
    feed
}