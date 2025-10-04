const Blog = require('../models/blog');
const User = require('../models/User');

// 📚 Get all published blogs (public)
const getPublishedBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      author = '',
      tags = '',
      orderBy = 'timestamp',
      order = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { state: 'published' };

    if (search) query.$text = { $search: search };

    if (author) {
      const regex = new RegExp(author, 'i');
      const users = await User.find({
        $or: [{ first_name: regex }, { last_name: regex }]
      }).select('_id');
      query.author = { $in: users.map(u => u._id) };
    }

    if (tags) query.tags = { $in: tags.split(',').map(t => t.trim()) };

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort({ [orderBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalBlogs: total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: error.message });
  }
};

// 📝 Create blog (authenticated users)
const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.user._id,
      state: 'draft',
      read_count: 0,
      timestamp: new Date()
    });

    res.status(201).json({ success: true, data: { blog } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✏️ Update blog (owner only)
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      req.body,
      { new: true }
    );
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: { blog } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🚀 Publish/Unpublish
const togglePublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.state = blog.state === 'draft' ? 'published' : 'draft';
    await blog.save();

    res.json({ success: true, message: `Blog is now ${blog.state}`, data: { blog } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🗑️ Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 👁️ Get a single published blog
const getSinglePublishedBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, state: 'published' })
      .populate('author', 'first_name last_name email');

    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.read_count += 1;
    await blog.save();

    res.json({ success: true, data: { blog } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublishedBlogs,
  createBlog,
  updateBlog,
  togglePublishBlog,
  deleteBlog,
  getSinglePublishedBlog
};
