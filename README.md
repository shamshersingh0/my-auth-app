# JWT Authentication System

A simple yet powerful JWT authentication system with a Node.js/Express backend and React frontend.

## Features

✅ **JWT Token-based Authentication**
- Secure token generation on login
- Tokens expire after **1 minute**
- Token blacklisting on logout

✅ **Frontend (React + Tailwind CSS)**
- Beautiful login page
- Protected dashboard
- Real-time token expiry countdown
- Automatic logout on token expiration
- Responsive design

✅ **Backend (Node.js + Express)**
- Secure password hashing with bcryptjs
- JWT token verification middleware
- Protected API routes
- CORS enabled

## Project Structure

```
my-auth-app/
├── backend/
│   ├── server.js          # Express server with routes
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx       # Login page
    │   │   └── Dashboard.jsx   # Protected dashboard
    │   ├── components/
    │   │   └── ProtectedRoute.jsx  # Route protection
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx            # React entry point
    │   └── index.css           # Tailwind CSS
    ├── index.html
    ├── vite.config.js      # Vite configuration
    ├── tailwind.config.js  # Tailwind configuration
    └── package.json        # Frontend dependencies
```

## Installation & Setup

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server starts at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App starts at `http://localhost:3000`

## Test Credentials

- **Email:** `user@example.com`
- **Password:** `password123`

## API Endpoints

### Public Endpoints
- `POST /api/login` - User login
- `GET /api/health` - Health check

### Protected Endpoints
- `GET /api/user` - Get user information
- `POST /api/logout` - User logout

## How It Works

1. User enters credentials on the login page
2. Backend validates credentials and returns a JWT token
3. Frontend stores token in localStorage
4. Token is sent with every API request in Authorization header
5. Dashboard displays real-time token expiry countdown
6. Token automatically expires after 1 minute
7. User is logged out automatically when token expires
8. User can manually logout, which blacklists the token

## Security Features

✅ Password hashing with bcryptjs
✅ JWT token expiration
✅ Token blacklisting on logout
✅ Protected routes
✅ CORS enabled
✅ Environment variables for secrets
✅ Secure token verification

## Customization

### Change Token Expiration Time

Edit `backend/.env`:
```
JWT_EXPIRE=1m    # Change to desired duration (e.g., 15m, 1h)
```

### Change JWT Secret

Edit `backend/.env`:
```
JWT_SECRET=your_custom_secret_key
```

## Notes

- This is a demo application. For production, add proper database integration
- Use HTTPS in production
- Store tokens in HttpOnly cookies instead of localStorage for better security
- Implement proper refresh token mechanism for longer sessions
- Add proper error handling and logging
- Implement rate limiting for login attempts

## License

MIT
