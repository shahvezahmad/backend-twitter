const Comment = require("../Models/commentModel");
const Tweet = require("../Models/tweetModel");
const User = require("../Models/userModel");
const moment = require("moment");

//create comment
const createComment = (req, res) => {
    Comment.create(
      {
        content: req.body.content,
        postedCommentTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      },
      (err, newComment) => {
        if (!err) {
          Tweet.findOne({ postedTweetTime: req.params.tweetId }, (err, doc) => {
            if (!err) {
              User.findOne(
                { username: req.body.postedBy.username },
                (err, user) => {
                  if (!err) {
                    newComment.postedBy = user._id;
                    if (newComment.postedBy) {
                      newComment.save();
                      doc.comments.unshift(newComment._id);
                      doc.save();
                    } else
                      return res.json({
                        status: "error",
                        error: "An error occured",
                      });
                  }
                }
              );
  
              return res.json({
                comments: doc.comments.length,
                docs: doc.comments,
              });
            } else
              return res.json({ status: "error", error: "An error occured" });
          });
        }
      }
    );
  };

//delete comment
const deleteComment = (req, res) => {
    Comment.findOneAndDelete(
      { postedCommentTime: req.params.commentId },
      (err) => {
        if (!err) {
          return res.json({
            status: "ok",
          });
        } else console.log(err);
      }
    );
};

module.exports = {
    createComment,
    deleteComment
}