# 🎓 ProjectDes AI Academy

> **Transform Your Career with AI-Powered Education**  
> A comprehensive online education platform specializing in practical AI transformation training, inspired by the successful TeachMeSkills model and enhanced with cutting-edge AI capabilities.

## 🚀 Platform Overview

ProjectDes AI Academy is an enterprise-grade online education platform designed to transform working professionals into certified AI specialists through fast-track, project-based learning programs. Built on the proven success model of TeachMeSkills (12,000+ graduates), we've enhanced it with AI-powered personalization and international reach.

### 🎯 Core Mission
Transform careers through practical, employment-focused AI education with guaranteed job placement support and lifetime learning access.

## 📊 Business Model

### Target Audience
- **Primary**: Career changers (25-35 years) seeking tech transformation
- **Secondary**: Recent graduates needing practical skills
- **Tertiary**: Professionals in declining industries
- **Geographic**: Global reach with multi-language support (EN/RU/HE)

### Revenue Streams
- Individual course enrollments (85%)
- Corporate training programs (10%)
- Free courses for lead generation (5%)

### Pricing Strategy
- **Course Price Range**: $1,000-$1,500 per course
- **Payment Options**: 
  - 3-5 month installments
  - Bank financing up to 18 months
  - 10% discount for full payment
  - "Pay from second month" option

## 🎓 Educational Offerings

### Flagship Courses
1. **AI Transformation Manager** - Lead AI initiatives in organizations
2. **No-Code Website Development** - Build without traditional coding
3. **AI Video & Avatar Generation** - Create AI-powered content

### Course Categories
- **AI & Machine Learning**: Practical AI implementation
- **Web Development**: Frontend, Backend, Full-Stack
- **Data Science**: Analytics, BI, Data Engineering
- **Design & UX**: UI/UX, Motion Design, 3D Modeling
- **DevOps & Cloud**: Kubernetes, AWS, Security
- **Business Tech**: Project Management, Business Analysis

### Learning Format
- **Duration**: 3-9 months per program
- **Schedule**: Evening classes (19:00-22:00) 2-3x/week
- **Format**: 100% online via Zoom + recordings
- **Class Size**: 15-20 students for personalized attention
- **Language**: Multi-language (EN/RU/HE)

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS + Radix UI
- **Authentication**: JWT (Access + Refresh tokens)
- **Payments**: Stripe + PayPal integration
- **AI Services**: LangChain + OpenAI integration
- **Infrastructure**: PM2 + Nginx on dedicated servers

### Monorepo Structure
```
projectdes-academy/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   ├── ui/           # Shared components
│   ├── types/        # TypeScript types
│   ├── db/           # Database layer
│   └── utils/        # Shared utilities
├── ai/               # AI services
└── qa/               # Testing suites
```

## ✨ Key Features

### For Students
- 📚 Interactive live sessions with recordings
- 💼 Career Center with job placement
- 📊 Progress tracking and certificates
- 👥 Community and peer support
- 🎯 Project-based learning
- 🔄 Lifetime access to materials

### For Business
- 🏢 Corporate training programs
- 📈 Detailed analytics and reporting
- 🎓 Custom curriculum development
- 👥 Dedicated account management
- 📜 Enterprise certificates
- 🔐 SSO integration

### Platform Capabilities
- 🌍 Multi-language support (EN/RU/HE)
- 📱 Mobile-responsive design
- 💳 Flexible payment processing
- 📧 Automated email communications
- 📊 Analytics and tracking
- 🔒 Enterprise-grade security

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- pnpm 8+
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/projectdes-academy.git
cd projectdes-academy

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed

# Start development servers
pnpm dev
```

### Available Scripts

```bash
pnpm dev          # Start all development servers
pnpm build        # Build all applications
pnpm test         # Run test suites
pnpm lint         # Run linting
pnpm deploy       # Deploy to production
```

## 📈 Success Metrics

### Platform Goals
- 🎯 **10,000 students** in first 2 years
- 💼 **85% job placement rate** within 6 months
- ⭐ **4.8+ satisfaction rating**
- 🌍 **5+ country presence**
- 🏢 **50+ corporate partners**

### Current Status
- ✅ Production-ready codebase
- ✅ 28 database models implemented
- ✅ 32 API endpoints
- ✅ 20+ frontend pages
- ✅ 200+ test cases
- ✅ Security hardened

## 🤝 Competitive Advantages

### vs Traditional Education
- ✅ Practical, job-focused curriculum
- ✅ Industry professionals as instructors
- ✅ Real-world projects
- ✅ Career support included
- ✅ Flexible scheduling

### vs Other Platforms
- ✅ AI-powered personalization
- ✅ Guaranteed job placement support
- ✅ Lifetime learning access
- ✅ Multi-language support
- ✅ Affordable pricing with installments

## 🔒 Security & Compliance

- **Data Protection**: GDPR/CCPA compliant
- **Payment Security**: PCI DSS compliant
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Encryption**: TLS 1.3, bcrypt for passwords
- **Monitoring**: Sentry error tracking

## 📊 Performance Targets

- **Lighthouse Score**: 95+ Performance
- **Core Web Vitals**: 
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- **API Response**: < 200ms average
- **Uptime**: 99.9% SLA

## 🚀 Deployment

### Production Setup
```bash
# Build for production
pnpm build

# Run database migrations
pnpm db:migrate:prod

# Start with PM2
pm2 start ecosystem.config.js

# Configure Nginx
sudo nginx -s reload
```

### Infrastructure Requirements
- **Server**: 4 vCPU, 8GB RAM minimum
- **Database**: PostgreSQL 15+
- **Storage**: 100GB SSD
- **Bandwidth**: 1TB/month
- **SSL**: Let's Encrypt

## 📚 Documentation

- [Architecture Overview](./docs/architecture/)
- [API Documentation](./docs/api/)
- [Database Schema](./docs/database/)
- [Deployment Guide](./docs/deployment/)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 🙏 Acknowledgments

- Inspired by the success of TeachMeSkills.by
- Built with modern open-source technologies
- Designed for global impact

## 📞 Contact

- **Website**: [projectdes.ai](https://projectdes.ai)
- **Email**: info@projectdes.ai
- **Support**: support@projectdes.ai

---

**Status**: 🟢 Production Ready  
**Version**: 1.0.0  
**Last Updated**: December 2024

---

*Building the future of AI education, one career at a time.*