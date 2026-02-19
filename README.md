# Fraud Watch Dashboard

A comprehensive fraud detection dashboard with real-time transaction analysis, suspicious account detection, and fraud ring identification.

## Project Structure

```
fraud-watch-dashboard/
├── backend/          # Node.js/Express backend API
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Fraud detection logic
│   │   ├── types/    # TypeScript types
│   │   └── utils/    # Utility functions
│   └── package.json
└── src/              # React frontend
    ├── components/   # React components
    ├── lib/          # API client
    └── pages/        # Page components
```

## Features

- **CSV Upload**: Upload transaction data in CSV format
- **Real-time Analysis**: Analyze transactions for fraud patterns
- **Suspicious Account Detection**: Identify accounts with suspicious behavior patterns
- **Fraud Ring Detection**: Detect coordinated fraud rings
- **Network Visualization**: Visualize transaction networks
- **Report Download**: Export analysis results as JSON

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Install dependencies (from project root):
```bash
npm install
```

2. Create a `.env` file (optional, defaults to `http://localhost:3001`):
```bash
VITE_API_URL=http://localhost:3001
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## CSV Format

The CSV file should contain the following columns:

- `transaction_id`: Unique transaction identifier
- `sender_id`: Account ID of the sender
- `receiver_id`: Account ID of the receiver
- `amount`: Transaction amount (numeric)
- `timestamp`: Transaction timestamp (ISO format or any parseable date format)

Example:
```csv
transaction_id,sender_id,receiver_id,amount,timestamp
T001,A001,A002,1000.00,2024-01-01T10:00:00Z
T002,A002,A003,500.00,2024-01-01T10:05:00Z
```

## API Endpoints

### POST `/api/upload/analyze`
Upload and analyze a CSV file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (CSV file)

**Response:**
```json
{
  "summary": {
    "totalAccounts": 1247,
    "suspiciousAccounts": 38,
    "fraudRings": 5,
    "processingTime": 2.34
  },
  "suspiciousAccounts": [...],
  "fraudRings": [...],
  "networkGraph": {
    "nodes": [...],
    "edges": [...]
  }
}
```

### GET `/health`
Health check endpoint.

## Fraud Detection Patterns

The system detects the following suspicious patterns:

1. **Rapid Layering**: Many transactions in a short time period
2. **Circular Flow**: Accounts sending money back and forth
3. **Smurfing**: Many small transactions to avoid detection
4. **Funnel Account**: High incoming or outgoing with low opposite flow
5. **High Velocity**: Many unique connections
6. **Chain Transfer**: Linear transaction chains

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query

### Backend
- Node.js
- Express
- TypeScript
- CSV Parser
- Multer (file upload)

## Development

### Backend Development
```bash
cd backend
npm run dev      # Start with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## License

MIT
