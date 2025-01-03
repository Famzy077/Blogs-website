const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./model/post')
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config()
const Port = process.env.Port || 5000


// Middleware for parsing POST data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');  // Save images to public/uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Add a timestamp to the filename
  }
});
const upload = multer({ storage: storage });

// Database connection
mongoose.connect('mongodb://localhost/blogDB');

// Blog Post model
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
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      headline: req.body.headline,
      author: req.body.author,
      image: `/uploads/${req.file.filename}`
    });

    // Await the save method
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).send('Error creating post');
  }
});

// Delete a post by ID
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  // Validate the ObjectId format before proceeding
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
    console.error(err);  // Log the error to server console for debugging
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// Requesting for PHP login token to authenticate blog post to verify only registered company
// Example of a database model (could be MongoDB, MySQL, etc.)
// Assume you have a "Company" model with a function to find the company by ID
// Replace with actual database model based on your setup


// Middleware to authenticate and verify JWT
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) return res.sendStatus(401);  // No token, so redirect to login

//     jwt.verify(token, secretKey, async (err, company) => {
//         if (err) return res.sendStatus(403);  // Invalid token, possibly expired

//         // Check if the company is registered in the database
//         const registeredCompany = await Company.findById(company.company_id);
//         if (!registeredCompany) {
//             return res.status(403).json({ error: "Company not registered", redirectUrl: "/register" });
//         }

//         req.company = company;  // Store the decoded company info in the request
//         next();  // Proceed to the next route handler
//     });
// }

// // Apply the middleware to the routes that require authentication
// app.post('/api/posts', authenticateToken, (req, res) => {
//     const company = req.company;  // Access company info from the token

//     // Proceed with post creation logic if the company is authenticated and registered
//     console.log(`Company ${company.company_name} is creating a post...`);
    
//     // Post creation logic...
//     res.json({ message: "Blog post created successfully" });
// });


app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});