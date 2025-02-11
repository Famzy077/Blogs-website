const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('./cloudinary');
const path = require('path');
const fs = require('fs');
const Post = require('./model/post');
require('dotenv').config();

const app = express();
const Port = process.env.Port || 5000;

// Enable CORS
app.use(cors({
  origin: 'https://blog-three-gamma-51.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware for parsing POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '')));

// Multer configuration for temporary file storage
const upload = multer({ dest: 'uploads/' });

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
  }
});

// Database connection
mongoose.connect('mongodb+srv://blogProject:2t5trLjel0MUrdFb@cluster0.e3jkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
// mongoose.connect('mongodb://localhost:27017/blog')
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Database connection error:', error));

// API endpoint to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    res.status(500).send('Error fetching posts');
  }
});

// API endpoint to create a new post
app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const formattedDate = new Date().toLocaleDateString('en-US');

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const post = new Post({
      headline: req.body.headline,
      content: req.body.content,
      author: req.body.author,
      image: result.secure_url,
      date: formattedDate,
    });

    await post.save();
    res.status(201).json({ post, message: 'Successfully created a post!' });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Error creating post' });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }
  }
});

// API endpoint to delete a post by ID
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: 'Invalid post ID format' });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// Root endpoint to confirm server is running
app.get('/', (req, res) => {
  res.send('<h1>Blog server is running</h1>');
});

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});