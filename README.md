# ATMTA Full-Stack Technical Task

A full-stack admin dashboard built with NestJS, Next.js, TypeScript, TypeORM, and SQLite.

The application implements a dynamic Role-Based Access Control (RBAC) system for managing users, roles, permissions, categories, and vendors.

## Tech Stack

### Backend
- NestJS
- TypeScript
- TypeORM
- SQLite
- JWT Authentication
- class-validator
- bcrypt
- ExcelJS

### Frontend
- Next.js
- React
- TypeScript
- TanStack Query
- Tailwind CSS
- Sonner

## Main Features

### Authentication
- User login using JWT authentication.
- Protected backend endpoints.
- Protected frontend routes.
- Logout support.
- Inactive users cannot access protected resources.

### Role-Based Access Control (RBAC)
The authorization system is based on:

- Modules
- Actions
- Permissions
- Roles
- Role permissions
- User roles
- Direct user permissions

Modules and permissions are stored in the database rather than being defined only as hardcoded roles.

Permissions follow the format:

`module.action`

Examples:

- `users.read`
- `users.create`
- `vendors.update`
- `vendors.delete`
- `vendors.export`

A user can have multiple roles.

The final effective permissions are calculated from role permissions together with direct user grants and revokes.

Both the frontend and backend enforce permissions.

The frontend uses effective permissions to control module and action visibility, while the backend remains the final authorization layer and returns HTTP 403 for unauthorized operations.

### Users
- List users with pagination and search.
- Create users.
- Update users.
- Activate/deactivate users.
- Assign multiple roles.
- Assign direct permission grants/revokes.
- View user profile.
- Prevent unsafe modification of the last active Super Admin.

### Roles
- Create roles.
- Update roles.
- Delete roles.
- Assign permissions by module and action.
- Support custom module actions.

### Categories
- Arabic and English names.
- Unlimited nested categories.
- Parent/child relationships.
- Recursive category display.
- Search and pagination.
- Prevent invalid hierarchy cycles.
- Prevent deletion when a category has children or associated vendors.

### Vendors
- List vendors with pagination.
- Search vendors.
- Filter vendors by category and status.
- Create vendors.
- Update vendors.
- View vendor details.
- Soft delete vendors.
- Export vendors to Excel.
- Saudi mobile number normalization.
- Unique 10-digit commercial registration number validation.
- Track the user who created and last updated a vendor.

### Profile
The profile page displays:

- User information.
- Assigned roles.
- Effective permissions.
- Vendors created by the user.

## Project Structure

The project contains two main applications:
fullstackTask/
├── backend/
├── frontend/
└── README.md


## Deployment Steps

### Backend

1. Navigate to the backend directory and install deps:

```bash
cd backend
npm install
```
2. Create and configure the .env file with the required environment variables:

JWT_SECRET=your-production-secret
JWT_EXPIRES_IN=1h
FRONTEND_URL=https://your-frontend-domain.com

3. Build the NestJS application:
```bash
npm run build
```

4. Start the application in production mode:
```bash
npm run start:prod
``` 

### Frontend

1. Navigate to the frontend directory and install deps:

```bash
cd frontend
npm install
```
2. Create and configure the .env file with the required environment variables:

NEXT_PUBLIC_API_URL=https://your-backend-domain.com

3. Build the NestJS application:
```bash
npm run build
```

4. Start the application in production mode:
```bash
npm run start
``` 


## Possible Improvements

Given additional development time, the following improvements could further enhance the application:

- Enhance the overall UI/UX and visual design.
- Reuse a shared form component between Create and Edit screens where the form structure is identical.
- Introduce additional higher-level reusable components to reduce repeated UI and form logic.
- Add richer frontend validation with inline validation messages before requests are sent to the backend.
- Add image upload support instead of relying only on image URLs.
- Improve the role permissions UI by supporting "Select All" and bulk selection of actions within each module.
- Introduce lightweight lookup endpoints for dropdown data such as categories instead of reusing paginated listing APIs.
- Add more advanced filters, such as date ranges and additional status filters.
- Add sorting support to data tables.