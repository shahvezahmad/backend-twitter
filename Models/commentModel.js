const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
      content: {
        type: String,
        required: true,
      },
  
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      postedCommentTime: {
        type: String,
        default: moment().format("MMMM Do YYYY, h:mm:ss a"),
      },
      likes: {
        type: Array,
      },
      likeCommentBtn: {
        type: String,
        default: "black",
      },
      isEdited: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);