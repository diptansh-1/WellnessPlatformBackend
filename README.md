# Wellness Platform Backend

A Node.js/Express backend for the Wellness Platform, providing API endpoints for session management and user authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd wellness-platform/backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
}
```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
}
```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer your_token`
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com"
  }
}
```

### Session Endpoints

#### Get Public Sessions
- **GET** `/api/sessions`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `tags`: Comma-separated tags
- **Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [...],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50
    }
  }
}
```

#### Get User's Sessions
- **GET** `/api/my-sessions`
- **Headers:** `Authorization: Bearer your_token`
- **Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [...]
  }
}
```

#### Get Single Session
- **GET** `/api/my-sessions/:id`
- **Headers:** `Authorization: Bearer your_token`
- **Response:**
```json
{
  "success": true,
  "data": {
    "session": {...}
  }
}
```

#### Save Draft Session
- **POST** `/api/my-sessions/save-draft`
- **Headers:** `Authorization: Bearer your_token`
- **Body:**
```json
{
  "title": "Session Title",
  "tags": ["tag1", "tag2"],
  "json_file_url": "https://example.com/file.json"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "session": {...}
  }
}
```

#### Publish Session
- **POST** `/api/my-sessions/publish`
- **Headers:** `Authorization: Bearer your_token`
- **Body:**
```json
{
  "sessionId": "session_id",
  "title": "Session Title",
  "tags": ["tag1", "tag2"],
  "json_file_url": "https://example.com/file.json"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Session published successfully",
  "data": {
    "session": {...}
  }
}
```

#### Delete Session
- **DELETE** `/api/my-sessions/:id`
- **Headers:** `Authorization: Bearer your_token`
- **Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

## 🛡️ Security Features

- JWT Authentication
- Request Rate Limiting
- CORS Configuration
- Input Validation
- Secure Password Hashing
- Helmet Security Headers

## 🔧 Error Handling

All endpoints return error responses in the following format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error
