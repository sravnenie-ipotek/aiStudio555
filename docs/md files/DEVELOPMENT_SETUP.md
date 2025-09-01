# 🚀 AiStudio555 Academy - Development Setup Guide

## Quick Start (One Command)

```bash
# Clone the repository
git clone <repository-url> aistudio555-academy
cd aistudio555-academy

# Run the master setup script
chmod +x setup.sh
./setup.sh
```

This will automatically:

- ✅ Install all development tools
- ✅ Create project structure
- ✅ Setup Docker containers
- ✅ Configure environment
- ✅ Install dependencies
- ✅ Verify everything works

---

## Manual Setup Steps

If you prefer manual setup or the automated script fails:

### 1. Install Development Tools

```bash
# Run the installation script
chmod +x scripts/install-dev-tools.sh
./scripts/install-dev-tools.sh
```

Or install manually:

- **Node.js v20 LTS**: [nodejs.org](https://nodejs.org)
- **pnpm v9**: `npm install -g pnpm@9`
- **Docker Desktop**: [docker.com](https://docker.com)
- **Git**: `brew install git` (macOS)
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com)

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
code .env
```

### 3. Start Docker Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 4. Install Dependencies

```bash
# Install all packages
pnpm install
```

### 5. Setup Database

```bash
# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed

# Open Prisma Studio (optional)
pnpm db:studio
```

### 6. Start Development

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter web dev    # Frontend only
pnpm --filter api dev    # Backend only
```

---

## 🔍 Verification

Run the verification script to check your environment:

```bash
node scripts/verify-environment.js
```

This checks:

- ✅ All required tools installed
- ✅ Docker services running
- ✅ Environment variables set
- ✅ Project files present
- ✅ Ports available
- ✅ System resources

---

## 📁 Project Structure

```
aistudio555-academy/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express backend
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # TypeScript types
│   ├── db/               # Prisma database
│   └── utils/            # Shared utilities
├── ai/                   # AI integration (Phase 2)
├── qa/                   # Testing suites
├── infra/                # Infrastructure configs
├── docs/                 # Documentation
├── scripts/              # Setup & utility scripts
├── docker-compose.yml    # Docker services
├── .env                  # Environment variables
└── setup.sh             # Master setup script
```

---

## 🛠️ Daily Development Commands

### Docker Management

```bash
pnpm docker:up        # Start containers
pnpm docker:down      # Stop containers
pnpm docker:logs      # View logs
pnpm docker:reset     # Reset everything
```

### Database Operations

```bash
pnpm db:studio        # Open Prisma Studio
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database
```

### Development

```bash
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm lint             # Run linting
pnpm typecheck        # Check TypeScript
```

### Utilities

```bash
pnpm verify           # Verify environment
pnpm fresh            # Clean install everything
pnpm clean            # Clean build artifacts
```

---

## 🐳 Docker Services

### PostgreSQL Database

- **Container**: aistudio555-db
- **Port**: 5432
- **User**: aistudio555
- **Password**: localpassword
- **Database**: aistudio555_dev

### Redis Cache

- **Container**: aistudio555-redis
- **Port**: 6379
- **Database**: 0 (main), 1 (sessions)

### Optional Tools (with --profile tools)

```bash
# Start with admin tools
docker-compose --profile tools up -d
```

- **pgAdmin**: http://localhost:5050
- **Adminer**: http://localhost:8080
- **Redis Commander**: http://localhost:8081

---

## 🔧 VS Code Setup

1. **Open workspace**:

```bash
code .
```

2. **Install recommended extensions**:
   - VS Code will prompt to install workspace recommendations
   - Or run: `code --install-extension <extension-id>`

3. **Key extensions**:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - Prisma
   - GitLens

---

## 🚨 Troubleshooting

### Docker Issues

**Docker not running**:

```bash
# macOS
open /Applications/Docker.app

# Linux
sudo systemctl start docker
```

**Port already in use**:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Issues

**Cannot connect to PostgreSQL**:

```bash
# Check container is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart container
docker-compose restart postgres
```

**Migration errors**:

```bash
# Reset database
pnpm db:reset

# Force push schema
pnpm db:push
```

### Node/pnpm Issues

**Wrong Node version**:

```bash
# Use nvm to switch
nvm use 20
nvm alias default 20
```

**pnpm not found**:

```bash
npm install -g pnpm@9
```

### Environment Issues

**Missing .env file**:

```bash
cp .env.example .env
```

**Wrong environment variables**:

- Check `.env` file
- Ensure no spaces around `=`
- Use quotes for values with spaces

---

## 📋 Development Checklist

Before starting development, ensure:

- [ ] Node.js v20 installed
- [ ] pnpm v9 installed
- [ ] Docker Desktop running
- [ ] PostgreSQL container running
- [ ] Redis container running
- [ ] `.env` file configured
- [ ] Dependencies installed (`pnpm install`)
- [ ] Database migrated (`pnpm db:migrate`)
- [ ] VS Code configured
- [ ] Verification passing (`pnpm verify`)

---

## 🔐 Security Notes

1. **Never commit**:
   - `.env` files
   - API keys or secrets
   - `node_modules/`

2. **Always use**:
   - Environment variables for secrets
   - HTTPS in production
   - Parameterized queries (Prisma handles this)

3. **Regular updates**:

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update --interactive
```

---

## 📚 Additional Resources

- **Documentation**: `/docs/`
- **Architecture**: `/docs/architecture/`
- **Database Schema**:
  `/docs/architecture/baseArchitecture/complete-database-schema.md`
- **Design System**: `/docs/architecture/design/`
- **Infrastructure Steps**: `/TODO/infrustructureStartSteps.md`

---

## 🆘 Getting Help

1. **Check logs**:

```bash
# Docker logs
docker-compose logs -f

# Application logs
pnpm logs
```

2. **Run verification**:

```bash
node scripts/verify-environment.js
```

3. **Reset everything**:

```bash
# Complete reset
docker-compose down -v
rm -rf node_modules
pnpm fresh
```

4. **Contact support**:

- GitHub Issues
- Email: support@aistudio555.ai

---

## ✅ Ready to Code!

Once everything is set up:

1. Start development servers: `pnpm dev`
2. Open browser:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - Prisma Studio: http://localhost:5555

Happy coding! 🚀
