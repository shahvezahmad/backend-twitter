const Tweet = require("../Models/tweetModel");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

// feed
const getFeed = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tweetsToSkip = req.query.t || 0;

  try {
    const decoded = jwt.verify(token, "newSecretKey");
    const username = decoded.username;
    const user = await User.findOne({ username: username });

    const docs = await Tweet.find({ isRetweeted: false })
      .populate("postedBy")
      .populate("comments")
      .sort({ createdAt: -1 })
      .skip(tweetsToSkip)
      .limit(20)
      .exec();

    // Process the documents, set properties, etc.
    for (const doc of docs) {
      // Set properties based on conditions
      if (!doc.likes.includes(username)) {
        doc.likeTweetBtn = "black";
      } else {
        doc.likeTweetBtn = "deeppink";
      }

      // Set properties for comments
      for (const docComment of doc.comments) {
        if (!docComment.likes.includes(username)) {
          docComment.likeCommentBtn = "black";
        } else {
          docComment.likeCommentBtn = "deeppink";
        }
      }

      // Set properties for retweets
      if (!doc.retweets.includes(username)) {
        doc.retweetBtn = "black";
      } else {
        doc.retweetBtn = "green";
      }
    }

    return res.json({
      status: "ok",
      tweets: docs,
      activeUser: user,
    });
  } catch (error) {
    return res.json({ status: "error", error: "Session ended :(" });
  }
};

module.exports = {
  getFeed
};
