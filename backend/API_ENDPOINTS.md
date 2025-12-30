# API Endpoints Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### Health Check
- **GET** `/api/health`
- **Description:** Check if the server is running
- **Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-12-27T20:00:00.000Z"
}
```

### Analyze Code
- **POST** `/api/analysis`
- **Description:** Analyze code using LLM
- **Content-Type:** `application/json`
- **Request Body:**
```json
{
  "code": "const express = require('express');\nconst app = express();\napp.get('/users', (req, res) => {\n  res.send(req.body.name);\n});",
  "fileName": "server.js"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "Overall analysis summary...",
    "recommendations": ["recommendation1", "recommendation2"],
    "securityIssues": ["security issue 1", "security issue 2"],
    "architecturalIssues": ["architectural issue 1"],
    "performanceIssues": ["performance issue 1"],
    "score": 85
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "stack": "Error stack (only in development)"
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (missing code in body)
- `500` - Internal Server Error
