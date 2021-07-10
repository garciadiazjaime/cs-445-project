const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  id: String,
  likeCount: Number,
  commentsCount: Number,
  permalink: String,
  shortcode: String,
  caption: String,
  mediaUrl: String,
  mediaType: String,
  source: String,
  accessibility: String,

  user: Object,
  location: Object,

  label: String,
}, {
  timestamps: true,
});

const PostLabelSchema = new Schema({
  postId: String,
  labels: Array,
}, {
  timestamps: true,
});

const Post = mongoose.model('post', PostSchema);
const PostLabel = mongoose.model('postlabel', PostLabelSchema);

module.exports = {
  Post,
  PostLabel,
};
