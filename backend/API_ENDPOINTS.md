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

### Analysis Endpoints

#### Upload and Analyze Code
- **POST** `/api/analysis/upload`
- **Description:** Upload a code file for analysis
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with `file` field
- **Accepted File Types:** `.js`, `.ts`, `.jsx`, `.tsx`, `.json`
- **Max File Size:** 10MB (configurable via `MAX_FILE_SIZE` env var)
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "fileName": "example.js",
    "status": "pending",
    "message": "File uploaded successfully. Analysis will be processed."
  }
}
```

#### Get All Analyses
- **GET** `/api/analysis`
- **Description:** Get paginated list of all analyses
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response:**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "fileName": "example.js",
        "fileSize": 1024,
        "status": "completed",
        "ruleBasedResults": {
          "violations": [],
          "score": 100,
          "totalViolations": 0
        },
        "createdAt": "2024-12-27T20:00:00.000Z",
        "updatedAt": "2024-12-27T20:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### Get Analysis by ID
- **GET** `/api/analysis/:id`
- **Description:** Get detailed analysis by ID
- **URL Parameters:**
  - `id`: MongoDB ObjectId of the analysis
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fileName": "example.js",
    "filePath": "uploads/example-1234567890.js",
    "fileSize": 1024,
    "mimeType": "application/javascript",
    "codeContent": "const x = 1;",
    "ruleBasedResults": {
      "violations": [],
      "score": 100,
      "totalViolations": 0
    },
    "status": "completed",
    "createdAt": "2024-12-27T20:00:00.000Z",
    "updatedAt": "2024-12-27T20:00:00.000Z"
  }
}
```

#### Delete Analysis
- **DELETE** `/api/analysis/:id`
- **Description:** Delete an analysis and its associated file
- **URL Parameters:**
  - `id`: MongoDB ObjectId of the analysis
- **Response:**
```json
{
  "success": true,
  "message": "Analysis deleted successfully"
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
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

