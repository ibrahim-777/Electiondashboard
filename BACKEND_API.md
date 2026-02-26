# Election Dashboard - Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## API Endpoints

### Party Lists

#### Get All Party Lists
```http
GET /api/party-lists
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "التحالف التقدمي",
    "shortName": "ت.ت",
    "color": "#2563eb",
    "votes": 456789,
    "candidates": [
      {
        "id": 1,
        "name": "ماريا سانتوس",
        "personalVotes": 45678,
        "block": 3,
        "religion": "مسيحي"
      }
    ]
  }
]
```

#### Create Party List
```http
POST /api/party-lists
Content-Type: application/json

{
  "name": "اسم القائمة",
  "shortName": "ق.ق",
  "color": "#2563eb",
  "votes": 0,
  "candidates": []
}
```

#### Update Party List
```http
PUT /api/party-lists/:id
Content-Type: application/json

{
  "name": "اسم محدث",
  "votes": 123456
}
```

#### Delete Party List
```http
DELETE /api/party-lists/:id
```

---

### Candidates

#### Get All Candidates
```http
GET /api/candidates
```

#### Create Candidate
```http
POST /api/candidates
Content-Type: application/json

{
  "name": "اسم المرشح",
  "personalVotes": 0,
  "block": 1,
  "religion": "سني",
  "listId": 1
}
```

#### Update Candidate
```http
PUT /api/candidates/:id
Content-Type: application/json

{
  "personalVotes": 12345
}
```

#### Delete Candidate
```http
DELETE /api/candidates/:id
```

---

### Polling Boxes

#### Get All Polling Boxes
```http
GET /api/polling-boxes
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "صندوق 1",
    "block": 1,
    "blockName": "المنية",
    "center": "مركز المنية الأول",
    "room": "غرفة 1",
    "district": "المنية",
    "isOpened": true,
    "hasVotes": false
  }
]
```

#### Update Polling Box
```http
PUT /api/polling-boxes/:id
Content-Type: application/json

{
  "isOpened": true,
  "hasVotes": true
}
```

---

### Votes

#### Get All Votes
```http
GET /api/votes
```

**Response:**
```json
[
  {
    "boxId": 1,
    "listVotes": {
      "1": 150,
      "2": 200,
      "3": 100
    },
    "candidateVotes": {
      "1": 50,
      "2": 45
    },
    "rejectedVotes": 5,
    "blankVotes": 3,
    "totalVotes": 458
  }
]
```

#### Create Vote Entry
```http
POST /api/votes
Content-Type: application/json

{
  "boxId": 1,
  "listVotes": {
    "1": 150,
    "2": 200
  },
  "candidateVotes": {
    "1": 50,
    "2": 45
  },
  "rejectedVotes": 5,
  "blankVotes": 3,
  "totalVotes": 458
}
```

---

### Voters

#### Get All Voters
```http
GET /api/voters
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "محمد علي أحمد",
    "fatherName": "محمد أحمد",
    "motherName": "فاطمة محمد",
    "recordNumber": "101",
    "birthday": "1980-01-01",
    "sex": "ذكر",
    "block": "1",
    "district": "المنية",
    "center": "مركز المنية الأول",
    "room": "غرفة 1",
    "elected": false,
    "status": "none"
  }
]
```

#### Update Voter Status
```http
PATCH /api/voters/:id/status
Content-Type: application/json

{
  "status": "green"
}
```

#### Mark Voter as Elected
```http
PATCH /api/voters/:id/elected
Content-Type: application/json

{
  "elected": true
}
```

---

### Mandubin (Representatives)

#### Get All Mandubs
```http
GET /api/mandubs
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "أحمد محمد حسن",
    "block": "1",
    "district": "المنية",
    "recordNumber": 1001,
    "religion": "سني",
    "phoneNumber": "71123456",
    "phoneCardType": "alfa",
    "mandubType": "رئيس مركز",
    "representative": "محمد عمر",
    "sex": "ذكر"
  }
]
```

#### Create Mandub
```http
POST /api/mandubs
Content-Type: application/json

{
  "name": "اسم المندوب",
  "block": "1",
  "district": "المنية",
  "recordNumber": 1001,
  "religion": "سني",
  "phoneNumber": "71123456",
  "phoneCardType": "alfa",
  "mandubType": "مندوب ثابت",
  "representative": "محمد",
  "sex": "ذكر"
}
```

#### Update Mandub
```http
PUT /api/mandubs/:id
Content-Type: application/json

{
  "phoneNumber": "71999999"
}
```

#### Delete Mandub
```http
DELETE /api/mandubs/:id
```

---

### Cars

#### Get All Cars
```http
GET /api/cars
```

**Response:**
```json
[
  {
    "id": 1,
    "type": "سيدان",
    "owner": 1,
    "plateNumber": "123456",
    "representative": "1",
    "isAvailable": true,
    "block": "1",
    "numberOfTours": 0
  }
]
```

#### Create Car
```http
POST /api/cars
Content-Type: application/json

{
  "type": "سيدان",
  "owner": 1,
  "plateNumber": "123456",
  "representative": "1",
  "isAvailable": true,
  "block": "1",
  "numberOfTours": 0
}
```

#### Update Car
```http
PUT /api/cars/:id
Content-Type: application/json

{
  "isAvailable": false
}
```

#### Update Car Availability
```http
PATCH /api/cars/:id/availability
Content-Type: application/json

{
  "isAvailable": true
}
```

#### Increment Tours
```http
PATCH /api/cars/:id/increment-tours
```

#### Delete Car
```http
DELETE /api/cars/:id
```

---

### Accounts

#### Get All Accounts
```http
GET /api/accounts
```

#### Login
```http
POST /api/accounts/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "permissions": ["dashboard", "manage", "edit"]
  }
}
```

---

### Results

#### Get Overview
```http
GET /api/results/overview
```

#### Get by Block
```http
GET /api/results/block/:blockId
```

#### Get Voter Turnout
```http
GET /api/results/voter-turnout
```

---

## Error Responses

All endpoints should return appropriate HTTP status codes:

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## CORS Configuration

The backend should allow CORS requests from the frontend:

```javascript
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type
```

---

## Notes

1. All POST, PUT, and PATCH requests should accept and return JSON
2. IDs are integers (auto-incrementing)
3. Arabic text should be properly encoded (UTF-8)
4. Date format: `YYYY-MM-DD`
5. The backend should maintain referential integrity (e.g., deleting a party list should handle its candidates)
