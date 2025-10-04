# Blog API

A RESTful Blog API built with *Node.js*, *Express*, and **MongoDB*. Users can register, log in, and create/manage blogs. Public blogs can be fetched without authentication.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- User registration and login with JWT authentication.
- Create, update, delete blogs (authenticated users only).
- Publish/unpublish blogs.
- Fetch all published blogs with pagination, search, author filter, and tags filter.
- Increment read count when a blog is viewed.
- Secure password hashing with bcrypt.

---

## Technologies

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js
- express-validator
- Nodemon (development)

---



