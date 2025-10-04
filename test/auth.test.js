const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/blogging-api-test');
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const userData = {
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@example.com',
    password: 'password123'
  };

  test('Signup - success', async () => {
    const res = await request(app).post('/api/auth/signup').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  test('Signup - fail (duplicate email)', async () => {
    const res = await request(app).post('/api/auth/signup').send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Signin - success', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: userData.email,
      password: userData.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  test('Signin - fail (wrong password)', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: userData.email,
      password: 'wrongpass'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
