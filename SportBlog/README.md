# SportBlog - Angular MVP Project

A soccer-themed sports blog application built with Angular 19, demonstrating core Angular concepts including routing, authentication, services, guards, and HTTP communication.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Testing Credentials](#testing-credentials)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Technical Stack](#technical-stack)

## 🎯 Project Overview

This is an **MVP (Minimum Viable Product)** sports blog application that demonstrates Angular frontend development skills. The application includes:

- **4 Main Pages**: Home, Post Details, Authentication, and Admin Dashboard
- **User Roles**: Regular users and administrators with role-based access control
- **Mock Backend**: All API calls are intercepted and handled by a mock REST API (no real backend required)
- **JWT Authentication**: Simulated JWT tokens stored in localStorage
- **CRUD Operations**: Full create, read, update, delete functionality for blog posts

## 🔧 How It Works

### Architecture Overview

The application follows Angular best practices with a service-based architecture:

1. **Routing System** (`app.routes.ts`)
   - Uses Angular Router with route parameters
   - Protected routes with route guards (authentication and admin role checks)
   - Lazy loading ready (standalone components)

2. **Authentication Flow**
   - `AuthService` manages user authentication state
   - Mock JWT tokens stored in `localStorage`
   - `authInterceptor` adds Bearer token to HTTP requests
   - `authGuard` protects routes requiring login
   - `adminGuard` restricts admin-only routes

3. **Data Management**
   - `PostService`, `CommentService`, `AuthService` handle data operations
   - All services use `HttpClient` with RxJS Observables
   - `mockApiInterceptor` intercepts HTTP requests and simulates a REST API
   - Data persisted in browser `localStorage` (survives page refresh)

4. **Mock Backend**
   - `mock-api.interceptor.ts` intercepts all HTTP requests
   - Simulates REST API endpoints: `/api/users`, `/api/posts`, `/api/comments`
   - Data stored in `localStorage` with key `sportblog_db_v1`
   - Supports GET, POST, PUT, DELETE operations

### Data Flow

```
Component → Service → HttpClient → Interceptor → Mock API → localStorage
                ↓
         Observable (RxJS)
                ↓
         Component updates UI
```

### Route Protection

- **Public Routes**: Home (`/`), Post Details (`/post/:id`), Auth (`/auth`)
- **Protected Routes**: Admin Dashboard (`/admin`) - requires admin role
- **Guards**: Check authentication status and user roles before allowing navigation

## 📦 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 18.x or higher recommended)
  - Check version: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)
  
- **npm** (comes with Node.js)
  - Check version: `npm --version`

- **Angular CLI** (will be installed locally, but can install globally)
  - Global install: `npm install -g @angular/cli@19`
  - Check version: `ng version`

### For University Computer Environments

University computers may have restrictions. If you encounter issues:

1. **No admin rights**: Use `npm install` without `-g` flag (local installation)
2. **Firewall/Proxy**: Configure npm proxy if needed:
   ```bash
   npm config set proxy http://proxy.university.edu:8080
   npm config set https-proxy http://proxy.university.edu:8080
   ```
3. **Port 4200 blocked**: Use a different port:
   ```bash
   ng serve --port 3000
   ```

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

If using Git:
```bash
git clone <repository-url>
cd SportBlog
```

Or extract the project folder to your desired location.

### Step 2: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd SportBlog
npm install
```

**Expected output**: This will download all dependencies listed in `package.json` (Angular, RxJS, TypeScript, etc.) into the `node_modules` folder.

**Time**: This may take 2-5 minutes depending on your internet connection.

**Troubleshooting**:
- If `npm install` fails, try: `npm install --legacy-peer-deps`
- Clear npm cache: `npm cache clean --force`
- Use a different registry: `npm install --registry https://registry.npmjs.org/`

### Step 3: Verify Installation

Check that Angular CLI is available:

```bash
npx ng version
```

You should see Angular CLI version 19.2.19 or similar.

## ▶️ Running the Project

### Development Server

Start the development server:

```bash
npm start
```

Or using Angular CLI directly:

```bash
ng serve
```

**Expected output**:
```
✔ Browser application bundle generation complete.
Initial chunk files | Names         |  Raw size
main-*.js           | main          | 311.12 kB

** Angular Live Development Server is listening on localhost:4200 **
```

### Access the Application

Open your web browser and navigate to:

```
http://localhost:4200
```

The application will automatically reload when you make changes to the source files.

### Using a Different Port

If port 4200 is already in use:

```bash
ng serve --port 3000
```

Then access: `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

Output will be in the `dist/sport-blog/` directory. You can serve it with any static file server.

## 🔐 Testing Credentials

The application comes with pre-seeded test accounts. Use these to test different user roles:

### Admin Account
- **Email**: `admin@sportblog.com`
- **Password**: `admin123`
- **Access**: Can view, create, edit, and delete posts. Can access Admin Dashboard.

### Regular User Account
- **Email**: `user@sportblog.com`
- **Password**: `user123`
- **Access**: Can view posts, read details, and add comments when logged in.

### Creating New Accounts

You can register new accounts through the Auth page. New users will have the "user" role by default.

### Resetting Mock Data

If you need to reset the mock database (clear all posts, comments, users):

1. Open browser DevTools (F12)
2. Go to **Application** tab → **Local Storage** → `http://localhost:4200`
3. Delete the key: `sportblog_db_v1`
4. Refresh the page

The application will automatically re-seed with default data.

## 📁 Project Structure

```
SportBlog/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   │   ├── header/          # Navigation header
│   │   │   └── post-card/       # Blog post card component
│   │   ├── guards/              # Route guards
│   │   │   ├── auth.guard.ts    # Authentication guard
│   │   │   └── admin.guard.ts   # Admin role guard
│   │   ├── mock/                # Mock backend
│   │   │   ├── mock-api.interceptor.ts  # REST API simulation
│   │   │   └── auth-interceptor.ts      # JWT token injection
│   │   ├── models/              # TypeScript interfaces
│   │   │   ├── user.model.ts
│   │   │   ├── post.model.ts
│   │   │   ├── comment.model.ts
│   │   │   └── auth-token.model.ts
│   │   ├── pages/               # Page components
│   │   │   ├── home/            # Home page (post list)
│   │   │   ├── post-details/    # Post details with comments
│   │   │   ├── auth/            # Login/Register page
│   │   │   └── admin-dashboard/ # Admin CRUD interface
│   │   ├── pipes/               # Custom pipes
│   │   │   └── truncate.pipe.ts # Text truncation pipe
│   │   ├── services/            # Data services
│   │   │   ├── auth.service.ts  # Authentication service
│   │   │   ├── post.service.ts  # Blog post service
│   │   │   └── comment.service.ts # Comment service
│   │   ├── app.component.ts     # Root component
│   │   ├── app.config.ts        # App configuration
│   │   └── app.routes.ts        # Route definitions
│   ├── index.html               # Main HTML file
│   ├── main.ts                  # Application entry point
│   └── styles.css               # Global styles
├── angular.json                  # Angular configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## ✨ Key Features

### Angular Concepts Demonstrated

1. **Routing & Navigation**
   - Angular Router with route parameters (`/post/:id`)
   - Programmatic navigation
   - Route guards for protection

2. **Services & Dependency Injection**
   - Injectable services (`@Injectable`)
   - Service-based architecture
   - Dependency injection with `inject()` function

3. **HTTP Communication**
   - `HttpClient` for API calls
   - RxJS Observables for async operations
   - HTTP interceptors for request/response handling

4. **Forms & Validation**
   - Reactive Forms (`FormGroup`, `FormControl`)
   - Form validation (required, minLength, etc.)
   - Custom validation logic

5. **Pipes**
   - Built-in pipes (`DatePipe`, `AsyncPipe`)
   - Custom pipe (`TruncatePipe`)

6. **Route Guards**
   - `CanActivateFn` functional guards
   - Authentication checking
   - Role-based access control

7. **Standalone Components**
   - Angular 19 standalone component architecture
   - No NgModules required

### User Features

- ✅ View blog posts on home page
- ✅ Read full post details
- ✅ Add comments (when logged in)
- ✅ User registration and login
- ✅ Admin dashboard for post management
- ✅ Create, edit, and delete posts (admin only)
- ✅ Category filtering
- ✅ Responsive design

## 🛠 Technical Stack

- **Framework**: Angular 19.2.0
- **Language**: TypeScript 5.7.2
- **Styling**: CSS (no external CSS framework)
- **State Management**: RxJS Observables
- **Build Tool**: Angular CLI / esbuild
- **Package Manager**: npm

## 📝 Additional Notes

### Mock Backend Details

- All API endpoints are simulated (no real server required)
- Data persists in browser localStorage
- JWT tokens are mock tokens (not cryptographically secure)
- API endpoints follow REST conventions:
  - `GET /api/posts` - Get all posts
  - `GET /api/posts/:id` - Get single post
  - `POST /api/posts` - Create post
  - `PUT /api/posts/:id` - Update post
  - `DELETE /api/posts/:id` - Delete post
  - Similar patterns for `/api/comments` and `/api/users`

### Development Tips

- Use browser DevTools to inspect localStorage data
- Check Network tab to see intercepted HTTP requests
- Angular DevTools extension recommended for debugging
- Hot reload is enabled - changes reflect immediately

### Common Issues

**Issue**: `ng serve` fails with port error
- **Solution**: Use `ng serve --port 3000` or kill process on port 4200

**Issue**: Styles not updating
- **Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: Mock data not loading
- **Solution**: Clear localStorage and refresh page

**Issue**: TypeScript errors
- **Solution**: Run `npm install` again to ensure all types are installed

## 📚 Learning Resources

- [Angular Documentation](https://angular.dev)
- [Angular Router Guide](https://angular.dev/guide/router)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Project Status**: MVP Complete ✅  
**Last Updated**: 2024  
**Angular Version**: 19.2.0
