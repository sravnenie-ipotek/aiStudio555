# AiStudio555 Academy API

Express.js backend API for the AiStudio555 AI Academy platform.

## Features

- 🔐 JWT Authentication with refresh tokens
- 👥 Role-based authorization (Student, Instructor, Admin, Support)
- 📚 Course management and enrollment
- 💳 Stripe & PayPal payment integration
- 🔒 Comprehensive security (Helmet, CORS, rate limiting)
- 📊 Full TypeScript implementation
- 🗄️ PostgreSQL with Prisma ORM

## Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Configure your `.env` file with:
   - Database URL
   - JWT secrets
   - Stripe API keys
   - PayPal credentials

3. Install dependencies:
```bash
pnpm install
```

4. Run database migrations:
```bash
pnpm prisma migrate dev
```

5. Start development server:
```bash
pnpm dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/enrollments/my` - Get user enrollments
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users` - List all users (Admin)
- `PUT /api/users/:id/role` - Update user role (Admin)

### Payments
- `POST /api/payments/stripe/checkout` - Create Stripe session
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `POST /api/payments/paypal/capture-order` - Capture PayPal payment
- `GET /api/payments/my` - Get payment history
- `POST /api/payments/apply-coupon` - Apply coupon code

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/paypal` - PayPal webhook handler

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Check TypeScript types

## Architecture

```
apps/api/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API route definitions
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic (future)
│   ├── utils/          # Helper functions (future)
│   ├── app.ts          # Express app configuration
│   ├── server.ts       # Server entry point
│   └── index.ts        # Main entry point
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## Security Features

- JWT tokens with short expiry (15 min access, 7 day refresh)
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints
- Helmet.js security headers
- CORS configuration
- Input validation with Zod
- SQL injection protection via Prisma

## Next Steps

- [ ] Complete email verification flow
- [ ] Add Redis for session management
- [ ] Implement file upload for avatars
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Create comprehensive test suite
- [ ] Add request logging and monitoring
- [ ] Implement WebSocket support for real-time features