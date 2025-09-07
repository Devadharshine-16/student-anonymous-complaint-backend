# Complaint Management System - Backend

A Node.js backend API for managing student complaints with MongoDB integration.

## Features

- ✅ MongoDB connection with Mongoose ODM
- ✅ RESTful API endpoints for complaints
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend integration
- ✅ Structured project architecture (MVC pattern)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   ```bash
   # On Windows (if MongoDB is installed as a service)
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   
   # Or manually
   mongod
   ```

3. **Environment Variables (Optional):**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/complaintsDB
   PORT=3005
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3005 (or the port specified in your environment variables).

## API Endpoints

### Complaints

- `POST /api/complaints` - Create a new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/user/:studentID` - Get complaints by student ID
- `PUT /api/complaints/:id` - Update a complaint
- `DELETE /api/complaints/:id` - Delete a complaint

### Health Check

- `GET /health` - Server health status

## Database Schema

### Complaint Model
```javascript
{
  name: String (required),
  studentID: String (required, unique),
  department: String (required),
  complaint: String (required, min 10 chars),
  status: String (enum: Pending, In Progress, Resolved, Rejected),
  priority: String (enum: Low, Medium, High, Urgent),
  assignedTo: String,
  resolution: String,
  createdAt: Date,
  updatedAt: Date
}
```

## MongoDB Connection

The application connects to MongoDB using the following configuration:
- **Default URL**: `mongodb://127.0.0.1:27017/complaintsDB`
- **Connection Options**: Optimized for performance and reliability
- **Error Handling**: Graceful fallback and informative error messages

## Project Structure

```
backend/
├── app/
│   ├── config/
│   │   └── db.config.js      # Database configuration
│   ├── controllers/
│   │   └── complaint.controller.js  # Business logic
│   ├── models/
│   │   └── complaint.model.js       # Data models
│   └── routes/
│       └── complaint.routes.js      # API routes
├── db.js                    # Database connection
├── server.js               # Main server file
└── package.json
```

## Troubleshooting

### MongoDB Connection Issues

1. **Ensure MongoDB is running:**
   ```bash
   # Check if MongoDB is running
   mongo --eval "db.runCommand('ping')"
   ```

2. **Check MongoDB service status:**
   ```bash
   # Windows
   sc query MongoDB
   
   # Linux/macOS
   sudo systemctl status mongod
   ```

3. **Verify connection string:**
   - Default: `mongodb://127.0.0.1:27017/complaintsDB`
   - Make sure the port 27017 is not blocked by firewall

### Common Errors

- **ECONNREFUSED**: MongoDB is not running
- **Authentication failed**: Check MongoDB credentials if using authentication
- **Port already in use**: Change the port in environment variables

## Development

### Adding New Features

1. Create models in `app/models/`
2. Add controllers in `app/controllers/`
3. Define routes in `app/routes/`
4. Update `server.js` to include new routes

### Code Style

- Use ES6+ features
- Follow MVC pattern
- Implement proper error handling
- Add input validation
- Use async/await for database operations

## License

ISC License
