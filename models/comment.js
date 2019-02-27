const mongoose = require("mongoose");

// save reference to schema constructor
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: {
    type: String,
    validate: [
      function(input) {
        return input.length >= 1;
      },
      "comment length must be greater or equal to 1"
    ]
  }
});

// create the model using the mongoose method
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;