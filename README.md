# COMP3133 Assignment 2 - Full-Stack Employee Management App

**Student ID:** 100775883

This is a complete full-stack application for managing employees with authentication, CRUD operations, and search functionality.

**Technology Stack:**
- **Frontend:** Angular 21 (standalone components, lazy routing, reactive forms)
- **Backend:** Node.js + Express + Apollo GraphQL v4
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT with bcryptjs password hashing

---

## 🚀 Live Deployment

- **Backend (GraphQL):** https://one00775883-comp3133-assignment2.onrender.com/graphql
- **Frontend (Web App):** https://100775883-comp3133-assignment2.vercel.app

---

## 📋 Features

✅ User Authentication (Signup/Login with JWT)  
✅ Employee CRUD Operations (Create, Read, Update, Delete)  
✅ Search by Department & Position  
✅ Image Upload with Preview  
✅ Form Validation & Error Handling  
✅ Protected Routes with Auth Guard  
✅ MongoDB Database with Mongoose  

---

## 🏃 Quick Start (Local Development)

### Backend Setup
```bash
cd backend
npm install
npm start
# Backend runs at http://localhost:4000/graphql
```

### Frontend Setup
```bash
npm install
npm start
# Frontend runs at http://localhost:4200
```

### Database
MongoDB should be running locally at `mongodb://127.0.0.1:27017/comp3133_assignment2`

### Seed Sample Data
```bash
node backend/scripts/seed-employees.js
```

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
