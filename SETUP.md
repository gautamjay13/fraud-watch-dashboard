# Setup Guide - Fraud Watch Dashboard

## Quick Start

### 1. Install Backend Dependencies

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

### 2. Start the Backend Server

Keep the terminal in the `backend` folder and run:

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 CORS enabled for: all origins (development)
🌍 Environment: development
```

**Keep this terminal open!**

### 3. Install Frontend Dependencies

Open a **NEW** terminal window in the project root:

```bash
npm install
```

### 4. Start the Frontend

In the same terminal (project root), run:

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:8080/
```

### 5. Open in Browser

Open your browser and navigate to:
```
http://localhost:8080
```

## Troubleshooting

### "Failed to fetch" Error

1. **Check if backend is running**: Look for the server message in the backend terminal
2. **Check the port**: Backend should be on port 3001, frontend on 8080
3. **Check browser console**: Open DevTools (F12) and check for detailed error messages
4. **Try the health endpoint**: Visit `http://localhost:3001/health` in your browser - it should return `{"status":"ok",...}`

### Backend Won't Start

1. Make sure you're in the `backend` folder
2. Run `npm install` again
3. Check Node.js version: `node --version` (should be 18+)
4. Check for port conflicts: Make sure port 3001 is not in use

### Frontend Won't Connect

1. Check that backend is running on `http://localhost:3001`
2. Check browser console for CORS errors
3. Verify the API URL in `src/lib/api.ts` - should be `http://localhost:3001`

### CSV Upload Issues

1. Make sure your CSV has these columns:
   - `transaction_id` (or `id`)
   - `sender_id` (or `sender`)
   - `receiver_id` (or `receiver`)
   - `amount`
   - `timestamp` (or `date`)

2. Check backend terminal for error messages

## Testing the Connection

Test if backend is accessible:

```bash
# In a new terminal
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## File Structure

```
fraud-watch-dashboard/
├── backend/          # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── src/              # Frontend (React)
    ├── lib/
    │   └── api.ts    # API client
    └── components/
```

## Need Help?

Check the backend terminal for detailed error logs. The server logs all requests and errors.
