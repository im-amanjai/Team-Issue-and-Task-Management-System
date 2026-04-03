# Team Issue & Task Management System

A role-based issue tracking web app for internal teams. Admin manages users and issues, managers create and assign issues, and members work on assigned issues and update their status.

## Tech Stack

- React
- Vite
- Node.js
- Express
- MongoDB

## Roles

- Admin: manages users and overall issue visibility
- Manager: creates issues and assigns them to members
- Member: works on assigned issues and updates status

## Main Features

- Authentication with role-based access
- Admin-only protected login using a 4-digit admin code
- Issue creation and assignment workflow
- Status tracking across dashboards
- Comments on issues
- Responsive UI with dark mode

## Run Locally

### Backend

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_LOGIN_CODE=your_code
```

Run:

```bash
cd backend
npm install
npm run dev
```

### Frontend

Run:

```bash
cd frontend
npm install
npm run dev
