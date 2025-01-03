const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: String,
  headline: String,
  author: String,
  image: String  // Path or URL to the image
});
// console.log('Successfully Structure Database')

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
