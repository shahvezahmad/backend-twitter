const moment = require("moment");
const Tweet = require("../Models/tweetModel");
const User = require("../Models/userModel");
const multer = require("multer");
let path = require("path");

//compose tweet
const storageEngine1 = multer.diskStorage({
  destination: "tweetImages",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, callback) => {
  let pattern = /jpg|png|jpeg/; // reqex

  if (pattern.test(path.extname(file.originalname))) {
    callback(null, true);
  } else {
    callback("Error: not a valid file");
  }
};

const upload = multer({
  storage: storageEngine1,
  fileFilter,
});

const createTweet = async (req, res) => {
  try {
    const info = req.body;
    const tweetInfo = JSON.parse(req.body.tweet);
    console.log(tweetInfo);

    const newTweet = await Tweet.create({
      content: tweetInfo.content,
      retweets: [],
      postedTweetTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });

    if (info.image) {
      newTweet.image = info.image;
    } else {
      console.log("no image found");
    }

    const user = await User.findOne({ username: tweetInfo.postedBy.username });

    if (user) {
      newTweet.postedBy = user._id;
      newTweet.save();
      user.tweets.unshift(newTweet._id);
      user.save();
      return res.json({ image: info.image });
    } else {
      return res.json({ status: "error", error: "An error occurred" });
    }
  } catch (error) {
    return res.json({ status: "error", error: "An error occurred" });
  }
};


//delete tweet
//delete tweet
// delete tweet
const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findOneAndDelete({ postedTweetTime: req.params.tweetId });
    if (tweet) {
      return res.json({
        status: "ok",
      });
    } else {
      return res.json({ status: "error", error: "Tweet not found" });
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: "An error occurred" });
  }
};



// edit tweet
const editTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findOne({ postedTweetTime: req.params.tweetId });
    if (tweet) {
      tweet.content = req.body.content;
      tweet.isEdited = true;
      await tweet.save();
      return res.json({
        status: "ok",
      });
    } else {
      return res.json({ status: "error", error: "Tweet not found" });
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: "An error occurred" });
  }
};


//retweet
const retweet = async (req, res) => {
  try {
    const doc = await Tweet.findOne({ postedTweetTime: req.params.tweetId });
    if (doc) {
      if (!doc.retweets.includes(req.params.userName)) {
        // Create a new tweet
        const newTweet = await Tweet.create({
          content: doc.content,
          postedBy: doc.postedBy,
          likes: doc.likes,
          likeTweetBtn: doc.likeTweetBtn,
          image: doc.image,
          postedTweetTime: doc.postedTweetTime,
          retweetedByUser: req.params.userName,
          isRetweeted: true,
          retweetBtn: "green",
          retweets: [req.params.userName],
        });

        const user = await User.findOne({ username: req.params.userName });
        if (user) {
          user.tweets.unshift(newTweet._id);
          await user.save();
        } else {
          console.log("User not found.");
        }
      } else {
        const user = req.params.user;
        await Tweet.deleteOne({
          "postedBy.username": user,
          content: doc.content,
          isRetweeted: true,
        });

        const indexForRetweets = doc.retweets.indexOf(req.params.userName);
        doc.retweets.splice(indexForRetweets, 1);
        doc.retweetBtn = "black";
        await doc.save();
      }
      return res.json({ status: "ok" });
    } else {
      return res.json({ status: "error", error: "Tweet not found" });
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: "An error occurred" });
  }
};



module.exports = {
    createTweet,
    editTweet,
    deleteTweet,
    retweet
}