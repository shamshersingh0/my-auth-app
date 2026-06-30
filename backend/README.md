# JWT Authentication Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env` file with your JWT secret and expiration time.

3. Run the server:
   ```bash
   npm run dev
   ```

Server will start at `http://localhost:5000`

## API Endpoints

### Login
- **POST** `/api/login`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Returns: `{ token, user }`

### Get User Info (Protected)
- **GET** `/api/user`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

### Logout (Protected)
- **POST** `/api/logout`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ message }`

### Health Check
- **GET** `/api/health`
- Returns: Server status

## Test Credentials
- Email: `user@example.com`
- Password: `password123`

## Token Expiration
JWT tokens expire after **1 minute** by default. Token is sent in response after login.
