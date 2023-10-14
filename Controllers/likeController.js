const Tweet = require("../Models/tweetModel");
const Comment = require("../Models/commentModel");


const Like = (req, res) => {
    Tweet.find({ postedTweetTime: req.params.tweetId }, (err, docs) => {
      docs.forEach((doc) => {
        if (!err) {
          if (!doc.likes.includes(req.params.userName)) {
            doc.likes.push(req.params.userName);
            doc.likeTweetBtn = "deeppink";
            doc.save();
          } else {
            let indexForLikes = doc.likes.indexOf(req.params.userName);
            doc.likes.splice(indexForLikes, 1);
            doc.likeTweetBtn = "black";
            doc.save();
          }
        } else console.log(err);
      });
    });
};

const LikeComment = (req, res) => {
    Comment.findOne({ postedCommentTime: req.params.commentId }, (err, doc) => {
      if (!err) {
        if (!doc.likes.includes(req.params.userName)) {
          doc.likes.push(req.params.userName);
          doc.likeCommentBtn = "deeppink";
          doc.save();
          return res.json({ btnColor: "deeppink", likes: doc.likes.length });
        } else {
          let indexForLikes = doc.likes.indexOf(req.params.userName);
          doc.likes.splice(indexForLikes, 1);
          doc.likeCommentBtn = "black";
          doc.save();
          return res.json({ btnColor: "black", likes: doc.likes.length });
        }
      } else console.log(err);
    });
};

module.exports = {
    Like,
    LikeComment
}