const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Post = require('./model/post')
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
app.use(bodyParser.json()); // To parse JSON data

// Serve static files
app.use('/uploads', express.static('Public/uploads'));

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Database connection
mongoose.connect('mongodb+srv://blogProject:2t5trLjel0MUrdFb@cluster0.e3jkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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
    const post = new Post({
      headline: req.body.headline,
      content: req.body.content,
      author: req.body.author,
      image: `/uploads/${req.file.filename}`,
      date: formattedDate
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).send('Error creating post');
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
