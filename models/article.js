const mongoose = require("mongoose");

// save reference to the schema constructor
const Schema = mongoose.Schema;

// create schema for each article
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  comments: {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  },
  time: {
    type: Date,
    default: Date.now
  }
});

//this will create article model from the schema above with mongoose
let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;