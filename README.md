# Real-Time Chat App

A full-stack, real-time messaging application built with Express and React. Whether you're looking to host private conversations, share media seamlessly, or just explore how modern chat architectures work under the hood, this project has you covered.

### 1. Prerequisites

Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v22+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas account)
* [Cloudinary](https://cloudinary.com/) account (for media uploads)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/NadmanAlvee/chat-app.git
cd chat-app

# Install backend dependencies and start server
cd backend
yarn install
yarn start

# Install frontend dependencies and start client
cd frontend
yarn install
yarn run dev
```

## Features

* **Real-time Messaging**: Instant message delivery and status updates.
* **Authentication & Authorization**: Secure JWT-based authentication stored in HTTP-only cookies.
* **Media Uploads**: Cloudinary integration for quick image/avatar sharing.
* **Scalable Database**: MongoDB for flexible conversation and user data management.
  
## Tech Stack
### **Backend**
* **Node.js** & **Express** - Fast, lightweight REST API framework
* **MongoDB** & **Mongoose** - Document database & object modeling
* **JWT (JSON Web Tokens)** - User session management
* **Cloudinary** - Image hosting and media management
### **Frontend**
* **ReactJs** - Component-based UI library
---
