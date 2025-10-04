const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getPublishedBlogs,
  getSinglePublishedBlog,
  createBlog,
  updateBlog,
  togglePublishBlog,
  deleteBlog
} = require('../controllers/blogController');

router.get('/published', getPublishedBlogs);
router.get('/published/:id', getSinglePublishedBlog);
router.post('/', authenticate, createBlog);
router.patch('/:id', authenticate, updateBlog);
router.patch('/:id/publish', authenticate, togglePublishBlog);
router.delete('/:id', authenticate, deleteBlog);

module.exports = router;
