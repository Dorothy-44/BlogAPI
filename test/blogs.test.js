const request = require('supertest');
const app = require('../src/app'); // Your Express app
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
const jwt = require('../utils/jwt');

let token;
let userId;

beforeAll(async () => {
  const db = 'mongodb://127.0.0.1/blog_test';
  await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

  const user = await User.create({ first_name: 'Test', last_name: 'User', email: 'test@example.com', password: 'password' });
  userId = user._id;
  token = jwt.signToken({ userId: user._id });
});

afterAll(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Blog Routes', () => {
  test('Create blog', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Blog', content: 'Content' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.blog.title).toBe('Test Blog');
  });

  test('Get published blogs', async () => {
    const res = await request(app).get('/api/blogs/published');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
