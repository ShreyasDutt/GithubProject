# Pinterest Clone

A **Pinterest-like** web application built using **Node.js, Express, MongoDB**, and **EJS** for templating. This project is focused on learning backend development while providing basic Pinterest-like features such as posting, liking, commenting, and saving images to boards.

## Features
- User authentication (Signup/Login) with JWT-based session management
- Create, edit, and delete posts (images with descriptions)
- Like and comment on posts
- Create and manage boards to save posts
- Save and unsave pins (posts) to your profile
- Profile management (edit profile details)
- EJS-based frontend rendering

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap, CSS
- **Authentication**: JWT (JSON Web Tokens) & Cookies
- **Database**: MongoDB (Mongoose ORM)

## Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/ShreyasDutt/GithubProject.git
   cd GithubProject
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```sh
   JWT_SECRET=your_secret_key
   MONGO_URI=your_mongodb_connection_string
   ```
4. **Run the server:**
   ```sh
   npm start
   ```
   The app will be live at **`http://localhost:3000`**

## Routes Overview
### Authentication
- `POST /create` - Register a new user
- `POST /login` - Login user
- `GET /logout` - Logout user

### Posts
- `POST /post` - Create a new post
- `POST /like/:id` - Like/unlike a post
- `POST /comment/:id` - Add a comment to a post
- `POST /deletecomment/:id/:PostId` - Delete a comment

### Profile & Boards
- `GET /profile` - View user profile
- `POST /profile/update` - Update user profile
- `POST /createBoard` - Create a board
- `POST /savepin/:id` - Save/unsave a pin
- `POST /saveBoard/:BoardId/:PostId` - Save a post to a board
- `GET /editprofile` - Edit profile page

## Future Improvements
- Add **real-time notifications** for likes and comments
- Implement **drag-and-drop** for organizing boards
- Support **image uploads** instead of URLs
- Enhance UI with **React/Next.js** for better interactivity


