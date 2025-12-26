# Admin Panel Setup Guide

This guide explains how to set up and use the Admin Panel for the Real Estate Booking Web App.

## Features

- **Dashboard**: Overview of total users, properties, bookings, pending properties, and blocked users
- **User Management**: View all users and block/unblock them
- **Property Management**: View all properties and approve/reject them
- **Booking Management**: View all bookings across all users

## Backend Setup

### 1. Create an Admin User

You can create an admin user using the provided script:

```bash
cd server
node scripts/createAdmin.js <email> <password> <name>
```

Example:
```bash
node scripts/createAdmin.js admin@example.com admin123 "Admin User"
```

Alternatively, you can manually create an admin user in MongoDB:

```javascript
// In MongoDB shell or using a tool like MongoDB Compass
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "<hashed_password>", // Use bcrypt to hash password
  role: "admin",
  isBlocked: false
})
```

### 2. Backend API Endpoints

All admin endpoints require authentication with an admin token:

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/block` - Block/unblock a user
- `GET /api/admin/properties` - Get all properties
- `PUT /api/admin/properties/:id/approve` - Approve/reject a property (body: `{ status: "approved" | "rejected" }`)
- `GET /api/admin/bookings` - Get all bookings

## Frontend Setup

### 1. Access Admin Panel

Navigate to `/admin/login` in your browser.

### 2. Login

Use your admin credentials to log in. Only users with `role: "admin"` can access the admin panel.

### 3. Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Dashboard with statistics
- `/admin/users` - Manage users (block/unblock)
- `/admin/properties` - Manage properties (approve/reject)
- `/admin/bookings` - View all bookings

## Security Features

1. **Role-Based Access Control**: Only users with `role: "admin"` can access admin routes
2. **JWT Authentication**: All admin endpoints require a valid JWT token
3. **Blocked User Protection**: Blocked users cannot access any protected routes
4. **Route Protection**: Frontend routes are protected and redirect non-admin users

## Database Schema Changes

### User Model
- Added `role` field: `"user"` (default) or `"admin"`
- Added `isBlocked` field: `Boolean` (default: `false`)

### Residency Model
- Added `status` field: `"pending"` (default), `"approved"`, or `"rejected"`

## Important Notes

1. **Property Approval**: New properties are created with `status: "pending"` and only appear in the public listing after admin approval
2. **User Blocking**: Blocked users cannot log in or access any protected routes
3. **Admin Protection**: Admin users cannot be blocked through the admin panel
4. **Property Filtering**: The public properties endpoint (`/api/residency/allresd`) only returns approved properties

## Troubleshooting

### Cannot access admin panel
- Ensure you're logged in with an admin account
- Check that the user has `role: "admin"` in the database
- Verify the JWT token is valid

### Properties not showing in public listing
- Check that properties have `status: "approved"` in the database
- Use the admin panel to approve pending properties

### Users cannot log in
- Check if the user is blocked (`isBlocked: true`)
- Unblock the user through the admin panel

