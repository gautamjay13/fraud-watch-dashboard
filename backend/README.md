# Fraud Watch Backend API

Backend API server for the Fraud Watch Dashboard.

## Features

- CSV file upload and parsing
- Transaction analysis and fraud detection
- Suspicious account detection with pattern recognition
- Fraud ring identification
- Network graph generation
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### POST `/api/upload/analyze`
Upload a CSV file for analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (CSV file)

**CSV Format:**
Required columns: `transaction_id`, `sender_id`, `receiver_id`, `amount`, `timestamp`

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

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Frontend origin URL (default: http://localhost:8080)
