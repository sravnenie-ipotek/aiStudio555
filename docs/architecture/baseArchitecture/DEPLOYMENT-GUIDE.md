# AiStudio555 - Deployment Guide

**Purpose**: Complete deployment guide for AiStudio555 platform  
**Strategy**: Dedicated server deployment for production control  
**Last Updated**: December 2024  
**Status**: Production Ready

This document describes the production deployment approach for AiStudio555 using
dedicated servers, providing better control, cost efficiency, and performance
than cloud-based solutions.

---

## 📋 Table of Contents

1. [Deployment Strategy](#deployment-strategy)
2. [Server Specifications](#server-specifications)
3. [Software Stack Installation](#software-stack-installation)
4. [Database Configuration](#database-configuration)
5. [Application Deployment](#application-deployment)
6. [Web Server Configuration](#web-server-configuration)
7. [Security Setup](#security-setup)
8. [Monitoring & Health Checks](#monitoring-health-checks)
9. [Backup Strategy](#backup-strategy)
10. [Zero-Downtime Deployment](#zero-downtime-deployment)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting](#troubleshooting)

---

## 🚀 Deployment Strategy

### Primary Deployment Method

- **Strategy**: Dedicated server deployment
- **OS**: Ubuntu 22.04 LTS
- **Process Manager**: PM2 with cluster mode
- **Web Server**: Nginx (reverse proxy + SSL termination)
- **SSL**: Let's Encrypt via Certbot
- **Database**: PostgreSQL with PgBouncer connection pooling

### Advantages Over Cloud

- **Full Control**: Complete server administration
- **Better Performance**: Dedicated resources
- **Cost Efficiency**: ~$130-230/month vs $90-140/month cloud (with more
  resources)
- **No Vendor Lock-in**: Portable infrastructure
- **Multi-Project Hosting**: Can host multiple applications

---

## 🖥️ Server Specifications

### Production Server Requirements

```yaml
Application Server:
  CPU: 8 vCPUs (Intel Xeon or AMD EPYC)
  RAM: 32GB DDR4
  Storage: 500GB NVMe SSD
  Network: 1Gbps bandwidth
  OS: Ubuntu 22.04 LTS

Database Server (if separate):
  CPU: 4 vCPUs
  RAM: 16GB DDR4
  Storage: 1TB NVMe SSD (RAID 10 recommended)
  Backup: Daily automated snapshots
  Network: 1Gbps bandwidth
```

### Recommended Providers

- **Hetzner**: Excellent price/performance ratio
- **OVH**: Good European coverage
- **DigitalOcean**: Easy management interface
- **Vultr**: High-frequency compute instances

---

## ⚙️ Software Stack Installation

### Base System Setup

```bash
# System update
sudo apt update && sudo apt upgrade -y

# Essential packages
sudo apt install -y \
  curl \
  git \
  build-essential \
  nginx \
  postgresql-14 \
  postgresql-contrib \
  redis-server \
  certbot \
  python3-certbot-nginx \
  ufw \
  fail2ban \
  htop \
  ncdu \
  unzip

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 for process management
sudo npm install -g pm2

# pnpm for package management
sudo npm install -g pnpm

# PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### User Setup

```bash
# Create application user
sudo useradd -m -s /bin/bash aistudio555
sudo usermod -aG sudo aistudio555

# Switch to application user
sudo su - aistudio555

# Generate SSH key for deployments
ssh-keygen -t rsa -b 4096 -C "deploy@aistudio555.com"
```

---

## 🗄️ Database Configuration

### PostgreSQL Optimization

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Performance tuning (for 32GB RAM server)
shared_buffers = 8GB
effective_cache_size = 24GB
maintenance_work_mem = 2GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10485kB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_connections = 200

# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql
```

### PgBouncer Connection Pooling

```bash
# Install PgBouncer
sudo apt install -y pgbouncer

# Configure PgBouncer
sudo nano /etc/pgbouncer/pgbouncer.ini

# Configuration content:
[databases]
aistudio555 = host=127.0.0.1 port=5432 dbname=aistudio555

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 50

# Start PgBouncer
sudo systemctl start pgbouncer
sudo systemctl enable pgbouncer
```

### Database Setup

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE aistudio555;
CREATE USER aistudio555 WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE aistudio555 TO aistudio555;
ALTER USER aistudio555 CREATEDB;  -- For migrations
\q
```

---

## 📁 Application Deployment

### Directory Structure

```bash
# Create application directories
sudo mkdir -p /var/www/aistudio555/{releases,shared,repo}
sudo chown -R aistudio555:aistudio555 /var/www/aistudio555

# Shared directory structure
mkdir -p /var/www/aistudio555/shared/{logs,uploads,config}
```

### Environment Configuration

```bash
# Create production environment file
cat > /var/www/aistudio555/shared/.env << 'EOF'
# Database
DATABASE_URL="postgresql://aistudio555:password@127.0.0.1:6432/aistudio555"

# Application
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
API_URL=https://aistudio555.com/api

# AI Configuration
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-4o-mini
AI_RATE_LIMIT_RPM=60
AI_GUARDRAILS=strict

# Redis
REDIS_URL=redis://127.0.0.1:6379

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_key

# Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Analytics
GOOGLE_ANALYTICS_ID=G-...
GTM_ID=GTM-...
EOF

# Secure the environment file
chmod 600 /var/www/aistudio555/shared/.env
```

### PM2 Ecosystem Configuration

```javascript
// /var/www/aistudio555/shared/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'aistudio555-web',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/aistudio555/current/apps/web',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/www/aistudio555/shared/logs/web-error.log',
      out_file: '/var/www/aistudio555/shared/logs/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
    {
      name: 'aistudio555-api',
      script: './dist/server.js',
      cwd: '/var/www/aistudio555/current/apps/api',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/www/aistudio555/shared/logs/api-error.log',
      out_file: '/var/www/aistudio555/shared/logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};
```

---

## 🌐 Web Server Configuration

### Nginx Setup

```nginx
# /etc/nginx/sites-available/aistudio555.com

# Upstream servers
upstream web_backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    keepalive 64;
}

upstream api_backend {
    least_conn;
    server 127.0.0.1:4000;
    server 127.0.0.1:4001;
    server 127.0.0.1:4002;
    server 127.0.0.1:4003;
    keepalive 64;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=3r/m;
limit_conn_zone $binary_remote_addr zone=addr:10m;

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name aistudio555.com www.aistudio555.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name aistudio555.com www.aistudio555.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/aistudio555.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aistudio555.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'self';" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss application/atom+xml image/svg+xml;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_comp_level 6;

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2|woff|ttf|eot|svg)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Next.js app
    location / {
        limit_req zone=general burst=20 nodelay;
        limit_conn addr 10;

        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    # API endpoints
    location /api {
        limit_req zone=general burst=30 nodelay;

        # Special rate limiting for auth endpoints
        location ~* /api/auth/(login|register|forgot-password) {
            limit_req zone=auth burst=5 nodelay;
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable Site & SSL

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/aistudio555.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d aistudio555.com -d www.aistudio555.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔒 Security Setup

### Firewall Configuration

```bash
# UFW firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

### Fail2ban Configuration

```bash
# Configure Fail2ban
sudo nano /etc/fail2ban/jail.local

# Add configuration:
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10

# Start Fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### SSH Security

```bash
# Secure SSH configuration
sudo nano /etc/ssh/sshd_config

# Key changes:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 22
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2

# Restart SSH
sudo systemctl restart ssh
```

---

## 📊 Monitoring & Health Checks

### System Monitoring Script

```bash
#!/bin/bash
# /opt/monitoring/check_health.sh

ALERT_EMAIL="admin@aistudio555.com"
SERVICES=("nginx" "postgresql" "redis-server" "pm2")

# Check disk usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Warning: Disk usage is $DISK_USAGE%" | mail -s "AiStudio555 Server Alert" $ALERT_EMAIL
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf "%.2f", ($3/$2) * 100.0}')
if (( $(echo "$MEM_USAGE > 80" | bc -l) )); then
    echo "Warning: Memory usage is $MEM_USAGE%" | mail -s "AiStudio555 Server Alert" $ALERT_EMAIL
fi

# Check CPU load
CPU_LOAD=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1 | sed 's/ //g')
CPU_CORES=$(nproc)
if (( $(echo "$CPU_LOAD > $CPU_CORES" | bc -l) )); then
    echo "Warning: CPU load is $CPU_LOAD (cores: $CPU_CORES)" | mail -s "AiStudio555 Server Alert" $ALERT_EMAIL
fi

# Check services
for service in "${SERVICES[@]}"; do
    if ! systemctl is-active --quiet $service; then
        echo "Service $service is down" | mail -s "AiStudio555 Service Alert" $ALERT_EMAIL
        systemctl restart $service
    fi
done

# Check application health
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)
if [ $HTTP_STATUS -ne 200 ]; then
    echo "Application health check failed (HTTP $HTTP_STATUS)" | mail -s "AiStudio555 App Alert" $ALERT_EMAIL
fi

# Log status
echo "$(date): Health check completed - Disk: $DISK_USAGE%, Memory: $MEM_USAGE%, CPU: $CPU_LOAD, HTTP: $HTTP_STATUS" >> /var/log/health-check.log
```

### PM2 Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# PM2 monitoring dashboard (optional)
pm2 web

# Save PM2 configuration
pm2 save
```

### Cron Jobs Setup

```bash
# Add monitoring to crontab
sudo crontab -e

# Add these lines:
# Health check every 5 minutes
*/5 * * * * /opt/monitoring/check_health.sh

# SSL certificate renewal (twice daily)
0 12 * * * /usr/bin/certbot renew --quiet

# Log rotation
0 0 * * * /usr/sbin/logrotate -f /etc/logrotate.d/nginx
```

---

## 🗂️ Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
# /opt/backup/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
DB_NAME="aistudio555"
APP_DIR="/var/www/aistudio555/current"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "$(date): Starting database backup..."
sudo -u postgres pg_dump $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Application files backup (excluding node_modules)
echo "$(date): Starting application backup..."
tar --exclude='node_modules' --exclude='.next' --exclude='dist' \
    -czf $BACKUP_DIR/app_$DATE.tar.gz $APP_DIR

# Configuration backup
tar -czf $BACKUP_DIR/config_$DATE.tar.gz \
    /etc/nginx/sites-available/aistudio555.com \
    /var/www/aistudio555/shared/.env \
    /var/www/aistudio555/shared/ecosystem.config.js

# Upload to remote storage (optional - configure your preferred method)
# aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://aistudio555-backups/
# aws s3 cp $BACKUP_DIR/app_$DATE.tar.gz s3://aistudio555-backups/

# Keep only 30 days of local backups
find $BACKUP_DIR -type f -mtime +30 -delete

# Log backup completion
echo "$(date): Backup completed - DB: db_$DATE.sql.gz, App: app_$DATE.tar.gz" >> /var/log/backup.log

# Send backup report
BACKUP_SIZE=$(du -sh $BACKUP_DIR/db_$DATE.sql.gz $BACKUP_DIR/app_$DATE.tar.gz | awk '{sum+=$1} END {print sum}')
echo "Backup completed successfully. Size: $BACKUP_SIZE" | mail -s "AiStudio555 Backup Report" admin@aistudio555.com
```

### Backup Cron Job

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * /opt/backup/backup.sh
```

---

## 🚀 Zero-Downtime Deployment

### Deployment Script

```bash
#!/bin/bash
# /opt/deploy/deploy.sh

set -e  # Exit on any error

REPO_URL="git@github.com:yourusername/aistudio555.git"
DEPLOY_DIR="/var/www/aistudio555"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$DEPLOY_DIR/releases/$TIMESTAMP"
BRANCH=${1:-main}

echo "$(date): Starting deployment of branch: $BRANCH"

# Pre-deployment checks
if ! systemctl is-active --quiet nginx; then
    echo "ERROR: Nginx is not running!"
    exit 1
fi

if ! systemctl is-active --quiet postgresql; then
    echo "ERROR: PostgreSQL is not running!"
    exit 1
fi

# Create release directory
mkdir -p $RELEASE_DIR
echo "$(date): Created release directory: $RELEASE_DIR"

# Clone latest code
echo "$(date): Cloning repository..."
git clone --branch $BRANCH --depth 1 $REPO_URL $RELEASE_DIR

# Navigate to release directory
cd $RELEASE_DIR

# Install dependencies
echo "$(date): Installing dependencies..."
pnpm install --frozen-lockfile

# Build applications
echo "$(date): Building applications..."
pnpm build

# Copy shared files
echo "$(date): Linking shared files..."
ln -sf $DEPLOY_DIR/shared/.env $RELEASE_DIR/.env
ln -sf $DEPLOY_DIR/shared/uploads $RELEASE_DIR/public/uploads

# Run database migrations
echo "$(date): Running database migrations..."
cd $RELEASE_DIR/packages/db
pnpm prisma migrate deploy

# Update symlink atomically
echo "$(date): Updating application symlink..."
cd $DEPLOY_DIR
ln -sfn $RELEASE_DIR current

# Reload PM2 processes
echo "$(date): Reloading PM2 processes..."
cp $DEPLOY_DIR/shared/ecosystem.config.js $RELEASE_DIR/
cd $RELEASE_DIR
pm2 reload ecosystem.config.js

# Wait for processes to stabilize
sleep 10

# Health check
echo "$(date): Performing health check..."
for i in {1..30}; do
    if curl -s http://localhost/health > /dev/null; then
        echo "$(date): Health check passed!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "ERROR: Health check failed after deployment!"
        # Rollback logic could go here
        exit 1
    fi
    sleep 2
done

# Clean old releases (keep last 5)
echo "$(date): Cleaning old releases..."
cd $DEPLOY_DIR/releases
ls -t | tail -n +6 | xargs rm -rf

# Reload Nginx (optional, for config changes)
sudo nginx -s reload

echo "$(date): Deployment completed successfully!"
echo "Active release: $TIMESTAMP"

# Send deployment notification
echo "AiStudio555 deployment completed successfully. Branch: $BRANCH, Release: $TIMESTAMP" | \
    mail -s "AiStudio555 Deployment Success" admin@aistudio555.com
```

### GitHub Actions Integration

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            /opt/deploy/deploy.sh ${{ github.ref_name }}
```

---

## ⚡ Performance Optimization

### Redis Configuration

```bash
# /etc/redis/redis.conf
maxmemory 4gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Restart Redis
sudo systemctl restart redis-server
```

### Node.js Optimization

```bash
# Environment variables for production
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"
export UV_THREADPOOL_SIZE=16
```

### System Optimization

```bash
# /etc/security/limits.conf
aistudio555 soft nofile 65536
aistudio555 hard nofile 65536

# /etc/sysctl.conf
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
fs.file-max = 2097152
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Application Won't Start

```bash
# Check PM2 status
pm2 status
pm2 logs

# Check environment variables
cat /var/www/aistudio555/shared/.env

# Check database connection
sudo -u postgres psql -c "\l"
```

#### High Memory Usage

```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Restart PM2 processes
pm2 restart all
```

#### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test Nginx configuration
sudo nginx -t
```

#### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check PgBouncer
sudo systemctl status pgbouncer

# Test database connection
psql -h localhost -p 6432 -U aistudio555 -d aistudio555
```

### Log Locations

- **Application Logs**: `/var/www/aistudio555/shared/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **PostgreSQL Logs**: `/var/log/postgresql/`
- **System Logs**: `/var/log/syslog`

---

## 💰 Cost Analysis

### Monthly Costs (Dedicated Server)

```yaml
Server Costs:
  Hetzner AX61: $60/month (16 cores, 64GB RAM, 2x512GB NVMe)
  OVH Advance-3: $120/month (8 cores, 32GB RAM, 2x512GB NVMe)

Additional Services:
  Backup Storage: $10-20/month
  Monitoring (optional): $10/month
  SSL Certificate: Free (Let's Encrypt)

Total Monthly: $70-150/month

Benefits vs Cloud:
  ✅ 2-3x more resources for same price ✅ Full control and customization ✅ No
  vendor lock-in ✅ Can host multiple projects ✅ Better performance and
  reliability
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Server provisioned and accessible
- [ ] Domain configured and DNS updated
- [ ] SSL certificates obtained
- [ ] Database created and configured
- [ ] Environment variables configured
- [ ] Backup strategy implemented

### Deployment Process

- [ ] Application deployed to release directory
- [ ] Dependencies installed
- [ ] Application built successfully
- [ ] Database migrations completed
- [ ] PM2 processes started
- [ ] Nginx configuration updated
- [ ] Health check passes

### Post-Deployment

- [ ] Monitoring configured and alerts working
- [ ] Backup system tested
- [ ] Performance metrics within targets
- [ ] Security hardening complete
- [ ] Documentation updated
- [ ] Team notified

---

**AiStudio555 deployment guide provides a robust, scalable, and secure
foundation for production hosting with full control over infrastructure and
optimized performance.**
