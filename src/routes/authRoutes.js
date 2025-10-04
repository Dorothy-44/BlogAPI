const express = require('express');
const { body } = require('express-validator');
const { signup, signin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', [
  body('first_name').notEmpty().withMessage('First name required'),
  body('last_name').notEmpty().withMessage('Last name required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], signup);

router.post('/signin', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required')
], signin);

module.exports = router;
