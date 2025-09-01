# 🔧 Environment Setup Guide

**ProjectDes AI Academy** - Complete environment configuration for development and production deployment.

## 🛠️ Prerequisites

```bash
# Required versions
Node.js >= 20.0.0
pnpm >= 9.0.0
PostgreSQL >= 14.0
Redis >= 6.0 (optional, for rate limiting)
```

## 📦 Quick Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Generate secure secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# 4. Setup database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Start development servers
pnpm dev
```

## 🔐 Security Configuration

### Critical Security Requirements

1. **JWT Secrets** - Must be 32+ characters, cryptographically secure
2. **Database Security** - Use strong passwords, proper connection strings
3. **CORS Configuration** - Restrict origins for production
4. **Rate Limiting** - Configure appropriate limits for your use case
5. **HTTPS** - Always use HTTPS in production

### Environment Variables Validation

```bash
# Run environment validation
pnpm verify
```

## 🗄️ Database Setup

### Development Database
```bash
# Local PostgreSQL setup
createdb aistudio555_academy
psql aistudio555_academy -c "CREATE USER admin WITH ENCRYPTED PASSWORD 'yourpassword';"
psql aistudio555_academy -c "GRANT ALL PRIVILEGES ON DATABASE aistudio555_academy TO admin;"

# Initialize database
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### Production Database
```bash
# For production deployment
DATABASE_URL="postgresql://admin:SECURE_PASSWORD@your-db-host:5432/aistudio555_academy?schema=public"
```

## 💳 Payment Integration

### Stripe Configuration
```env
# Test Keys (Development)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Live Keys (Production)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### PayPal Configuration
```env
# Sandbox (Development)
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id

# Live (Production)
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
```

## 🔒 Security Middleware Configuration

### Rate Limiting (Already Configured)
- General API: 1000 requests/15min
- Authentication: 5 requests/15min 
- Password Reset: 3 requests/hour
- Registration: 5 requests/hour
- Payment: 10 requests/10min

### Security Headers (Implemented)
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options, X-XSS-Protection
- Request size limits and input sanitization

## 🚀 Deployment Configuration

### Development
```bash
NODE_ENV=development
API_PORT=4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Production
```bash
NODE_ENV=production
API_PORT=4000
NEXT_PUBLIC_SITE_URL=https://academy.projectdes.ai
NEXT_PUBLIC_API_URL=https://api.academy.projectdes.ai
FRONTEND_URL=https://academy.projectdes.ai
ALLOWED_ORIGINS=https://projectdes.ai,https://www.projectdes.ai,https://academy.projectdes.ai
```

## 📊 Analytics & Monitoring

### Google Analytics 4
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Google Tag Manager
```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Error Monitoring (Sentry)
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## 🔍 Environment Validation

Create environment validation script to ensure all required variables are set:

```javascript
// scripts/verify-environment.js
const requiredEnvVars = {
  api: [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'STRIPE_SECRET_KEY',
    'PAYPAL_CLIENT_SECRET'
  ],
  web: [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID'
  ]
};

function validateEnvironment() {
  // Implementation in scripts/verify-environment.js
}
```

## 📝 Environment File Templates

### API Environment (apps/api/.env)
```env
# Database
DATABASE_URL="postgresql://admin:yourpassword@localhost:5432/aistudio555_academy?schema=public"

# Server
NODE_ENV=development
API_PORT=4000
HOST=0.0.0.0
FRONTEND_URL=http://localhost:3000

# JWT Secrets - CRITICAL: Use crypto.randomBytes(32).toString('hex')
JWT_SECRET=your-super-secure-jwt-secret-32-characters-minimum
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-32-characters-minimum
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# Payment Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Security Configuration
MAX_JSON_SIZE=10mb
MAX_URL_ENCODED_SIZE=10mb
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
GENERAL_RATE_LIMIT=1000
AUTH_RATE_LIMIT=5
SESSION_SECRET=your-super-secure-session-secret-32-chars-minimum
```

### Web Environment (apps/web/.env.local)
```env
# Environment
NODE_ENV=development

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## ⚠️ Security Checklist

- [ ] JWT secrets are 32+ characters and cryptographically secure
- [ ] Database credentials are strong and unique
- [ ] CORS origins are restricted to your domains
- [ ] Rate limiting is configured appropriately
- [ ] All secrets are stored securely (not in version control)
- [ ] HTTPS is enabled in production
- [ ] Security headers are configured
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive information
- [ ] Logs are monitored for security events

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check PostgreSQL is running
   - Verify connection string format
   - Ensure user has proper permissions

2. **JWT Token Errors**
   - Verify JWT_SECRET is set and secure
   - Check token expiration times
   - Ensure secrets match between services

3. **Payment Integration Issues**
   - Verify API keys are correct for environment
   - Check webhook endpoints are accessible
   - Ensure proper HTTPS configuration for production

4. **CORS Errors**
   - Verify ALLOWED_ORIGINS includes your frontend URL
   - Check for trailing slashes in URLs
   - Ensure ports match between frontend and backend

## 📞 Support

For environment setup issues:
1. Check logs in `logs/` directory
2. Verify environment variables with `pnpm verify`
3. Review security configuration
4. Check database connectivity