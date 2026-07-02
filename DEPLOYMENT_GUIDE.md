# 🚀 DEPLOYMENT & CONNECTION GUIDE

## Your Deployed URLs

**Frontend:** https://hellojwtbasedlogin-lm228iuq.b4a.run/
**Backend API:** https://jwtbasedlogin-s4o6o32t.b4a.run/

---

## ⚠️ Current Issue: "Login Failed"

### Root Cause
The frontend is trying to connect to `http://localhost:5000/api` but:
- Frontend is deployed on: `https://hellojwtbasedlogin-lm228iuq.b4a.run`
- Backend is deployed on: `https://jwtbasedlogin-s4o6o32t.b4a.run`
- Localhost doesn't exist in production!

---

## ✅ Solution

### Step 1: Update Frontend Environment Variables

Create/Update `frontend/.env` file with:

```bash
REACT_APP_API_URL=https://jwtbasedlogin-s4o6o32t.b4a.run/api
```

### Step 2: Update API Configuration

Update `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jwtbasedlogin-s4o6o32t.b4a.run/api';
```

### Step 3: Ensure CORS is Enabled on Backend

Backend already has CORS enabled via `cors()` middleware in `backend/src/app.js`

---

## 🔧 Local Development Setup

### If Running Locally:

1. **Backend (.env)**
```bash
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRE=1m
```

2. **Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Run Both:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 📋 Testing the Connection

### Test Backend is Working

```bash
curl https://jwtbasedlogin-s4o6o32t.b4a.run/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test Login Endpoint

```bash
curl -X POST https://jwtbasedlogin-s4o6o32t.b4a.run/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
}
```

---

## 🐛 Troubleshooting

### Problem 1: "Login Failed" Error

**Cause:** Frontend can't reach backend

**Fix:**
1. Check `REACT_APP_API_URL` environment variable
2. Verify backend URL is correct: `https://jwtbasedlogin-s4o6o32t.b4a.run`
3. Rebuild frontend after changing .env

### Problem 2: CORS Error

**Error Message:** `Access to XMLHttpRequest blocked by CORS policy`

**Fix:**
Backend CORS is already configured. If still failing:
1. Check backend is running
2. Verify frontend URL matches origin
3. Check all headers are correct

### Problem 3: Token Expired Immediately

**Fix:** Token expiry is set to 1 minute. This is intentional for demo.
To change, update `JWT_EXPIRE` in backend `.env`

---

## 📁 Environment Configuration Files

### Backend (.env)
```bash
PORT=5000
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=1m
NODE_ENV=production
API_URL=https://jwtbasedlogin-s4o6o32t.b4a.run
FRONTEND_URL=https://hellojwtbasedlogin-lm228iuq.b4a.run
```

### Frontend (.env)
```bash
REACT_APP_API_URL=https://jwtbasedlogin-s4o6o32t.b4a.run/api
REACT_APP_ENV=production
```

---

## 🔐 API Endpoints

All endpoints require `Authorization: Bearer <token>` except login and health check

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout (Protected)

### User
- **GET** `/api/users/profile` - Get user profile (Protected)

### Health
- **GET** `/api/health` - Server status

---

## 🧪 Test Credentials

```
Email: user@example.com
Password: password123

OR

Email: admin@example.com
Password: admin123
```

---

## ✅ Deployment Checklist

- [x] Backend deployed
- [x] Frontend deployed
- [ ] Update frontend `.env` with backend URL
- [ ] Rebuild frontend
- [ ] Verify CORS headers
- [ ] Test login flow
- [ ] Test token expiry
- [ ] Test logout

---

## 📞 Quick Commands

### View Environment Variables (Frontend)
```bash
echo $REACT_APP_API_URL
```

### Rebuild Frontend
```bash
cd frontend
npm install
npm run build
```

### Test Backend Health
```bash
curl -s https://jwtbasedlogin-s4o6o32t.b4a.run/api/health | jq .
```

---

## 🎯 Next Steps

1. **Update frontend .env file** with the backend URL
2. **Rebuild and redeploy frontend**
3. **Test login** on the frontend
4. **Verify token countdown** works (60 seconds)
5. **Test logout** button
