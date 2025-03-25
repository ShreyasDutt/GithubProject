# PinterestProject

A web application inspired by Pinterest, built using MongoDB, Express.js, EJS & Node.js

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **User Authentication**: Secure login and registration system.
- **Image Uploads**: Users can upload and manage images.
- **Boards**: Organize images into boards.
- **Responsive Design**: Optimized for various screen sizes.

## Project Structure

```
PinterestProject/
├── Models/             # Mongoose schemas for MongoDB collections
├── db/                 # Database connection and configuration
├── routes/             # Express route handlers
├── views/              # EJS templates for server-side rendering
├── .gitignore          # Specifies files and directories to be ignored by Git
├── App.js              # Main application file
├── package.json        # Project metadata and dependencies
└── package-lock.json   # Exact versions of npm dependencies
```

## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/ShreyasDutt/PinterestProject.git
   ```

2. **Navigate to the project directory**:

   ```sh
   cd PinterestProject
   ```

3. **Install dependencies**:

   ```sh
   npm install
   ```

4. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   SESSION_SECRET=your_session_secret
   ```

   Replace `your_mongodb_connection_string` and `your_session_secret` with your actual MongoDB URI and a secret key for session management.

## Usage

1. **Start the development server**:

   ```sh
   npm start
   ```

2. **Access the application**:

   Open [http://localhost:3000](http://localhost:3000) in your browser.


