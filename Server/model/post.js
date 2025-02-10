const mongoose = require('mongoose');

// Blog Post model
const postSchema = new mongoose.Schema({
  headline: String,
  content: String,
  author: String,
  image: String,
  date: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

console.log('Successfully Structure Database') 

module.exports = Post;