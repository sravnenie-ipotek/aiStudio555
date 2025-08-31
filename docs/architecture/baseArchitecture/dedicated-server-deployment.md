# Dedicated Server Deployment Architecture

> **PRIMARY DEPLOYMENT STRATEGY**: This document describes the production
> deployment approach for Projectdes AI Academy using dedicated servers. This
> replaces the previous cloud-based (Vercel/Railway) approach for better
> control, cost efficiency, and performance.

## Server Specifications

### Recommended Hardware

```yaml
Production Server:
  CPU: 8 vCPUs (Intel Xeon or AMD EPYC)
  RAM: 32GB DDR4
  Storage: 500GB NVMe SSD
  Network: 1Gbps
  OS: Ubuntu 22.04 LTS

Database Server (if separate):
  CPU: 4 vCPUs
  RAM: 16GB DDR4
  Storage: 1TB NVMe SSD (RAID 10)
  Backup: Daily snapshots
```

## Software Stack

### Base Installation

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
  redis-server \
  certbot \
  python3-certbot-nginx \
  ufw \
  fail2ban \
  htop \
  ncdu

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 for process management
sudo npm install -g pm2

# pnpm for package management
sudo npm install -g pnpm
```

## PostgreSQL Configuration

### Database Setup

```bash
# PostgreSQL optimization for dedicated server
sudo nano /etc/postgresql/14/main/postgresql.conf

# Performance tuning (for 32GB RAM)
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

# Connection pooling
max_connections = 200
```

### PgBouncer Setup (Connection Pooling)

```bash
sudo apt install -y pgbouncer

# Configure PgBouncer
sudo nano /etc/pgbouncer/pgbouncer.ini

[databases]
projectdes = host=127.0.0.1 port=5432 dbname=projectdes

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```

## Application Deployment

### Directory Structure

```
/var/www/
├── projectdes/
│   ├── current/      # Symlink to active release
│   ├── releases/     # Versioned releases
│   │   ├── 20240101120000/
│   │   ├── 20240102140000/
│   │   └── 20240103160000/
│   ├── shared/       # Shared files between releases
│   │   ├── .env
│   │   ├── uploads/
│   │   └── logs/
│   └── repo/         # Git repository
```

### PM2 Ecosystem Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'projectdes-web',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/projectdes/current/apps/web',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/www/projectdes/shared/logs/web-error.log',
      out_file: '/var/www/projectdes/shared/logs/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
    {
      name: 'projectdes-api',
      script: './dist/server.js',
      cwd: '/var/www/projectdes/current/apps/api',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/www/projectdes/shared/logs/api-error.log',
      out_file: '/var/www/projectdes/shared/logs/api-out.log',
      max_memory_restart: '1G',
    },
  ],
};
```

## Nginx Configuration

### Main Configuration

```nginx
# /etc/nginx/sites-available/projectdes.ai

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

server {
    listen 80;
    server_name projectdes.ai www.projectdes.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name projectdes.ai www.projectdes.ai;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/projectdes.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/projectdes.ai/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss;
    gzip_min_length 1000;

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2|woff|ttf)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
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
    }

    # API endpoints
    location /api {
        limit_req zone=general burst=30 nodelay;

        # Special rate limiting for auth endpoints
        location ~* /api/auth/(login|register|forgot-password) {
            limit_req zone=auth burst=5 nodelay;
            proxy_pass http://api_backend;
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

## Security Setup

### Firewall Configuration

```bash
# UFW setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Fail2ban configuration
sudo nano /etc/fail2ban/jail.local

[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
```

## Monitoring Setup

### System Monitoring

```bash
# Install monitoring tools
curl -sSL https://repos.insights.digitalocean.com/install.sh | sudo bash

# Netdata for real-time monitoring
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Custom monitoring script
cat > /opt/monitoring/check_health.sh << 'EOF'
#!/bin/bash

# Check disk usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Warning: Disk usage is $DISK_USAGE%" | mail -s "Server Alert" admin@projectdes.ai
fi

# Check memory
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
if (( $(echo "$MEM_USAGE > 80" | bc -l) )); then
    echo "Warning: Memory usage is $MEM_USAGE%" | mail -s "Server Alert" admin@projectdes.ai
fi

# Check services
services=("nginx" "postgresql" "redis-server" "pm2")
for service in "${services[@]}"; do
    if ! systemctl is-active --quiet $service; then
        echo "Service $service is down" | mail -s "Service Alert" admin@projectdes.ai
        systemctl restart $service
    fi
done
EOF

# Add to crontab
*/5 * * * * /opt/monitoring/check_health.sh
```

## Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
# /opt/backup/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
DB_NAME="projectdes"

# Database backup
pg_dump -U postgres -h localhost $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Application files backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/projectdes/current

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://projectdes-backups/
aws s3 cp $BACKUP_DIR/app_$DATE.tar.gz s3://projectdes-backups/

# Keep only 30 days of local backups
find $BACKUP_DIR -type f -mtime +30 -delete

# Cron job: 0 2 * * * /opt/backup/backup.sh
```

## Deployment Script

### Zero-Downtime Deployment

```bash
#!/bin/bash
# /opt/deploy/deploy.sh

REPO_URL="git@github.com:yourusername/projectdes-academy.git"
DEPLOY_DIR="/var/www/projectdes"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$DEPLOY_DIR/releases/$TIMESTAMP"

echo "Starting deployment..."

# Clone latest code
git clone $REPO_URL $RELEASE_DIR
cd $RELEASE_DIR

# Install dependencies
pnpm install --frozen-lockfile

# Build application
pnpm build

# Copy shared files
ln -s $DEPLOY_DIR/shared/.env $RELEASE_DIR/.env
ln -s $DEPLOY_DIR/shared/uploads $RELEASE_DIR/public/uploads

# Run migrations
cd $RELEASE_DIR/packages/database
npx prisma migrate deploy

# Update symlink
ln -sfn $RELEASE_DIR $DEPLOY_DIR/current

# Reload PM2
pm2 reload ecosystem.config.js

# Reload Nginx
sudo nginx -s reload

# Clean old releases (keep last 5)
cd $DEPLOY_DIR/releases
ls -t | tail -n +6 | xargs rm -rf

echo "Deployment complete!"
```

## Performance Optimization

### Redis Configuration

```bash
# /etc/redis/redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### Node.js Optimization

```bash
# Environment variables
NODE_ENV=production
NODE_OPTIONS="--max-old-space-size=4096"
UV_THREADPOOL_SIZE=16
```

## Monitoring Dashboard

### PM2 Web Dashboard

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 web
```

## Cost Comparison

### Dedicated Server vs Cloud

```yaml
Dedicated Server (Your Choice):
  Server: $100-200/month (Hetzner/OVH)
  Backup Storage: $20/month
  Monitoring: $10/month (optional)
  Total: ~$130-230/month

Cloud (Previous Plan):
  Vercel: $20/month
  Railway: $50-100/month
  CDN: $20/month
  Total: ~$90-140/month

Advantages of Dedicated:
  - Full control
  - Better performance
  - No vendor lock-in
  - More resources for same price
  - Can host multiple projects
```

## Security Checklist

- [x] Firewall configured (UFW)
- [x] Fail2ban installed
- [x] SSL certificates (Let's Encrypt)
- [x] Security headers configured
- [x] Rate limiting implemented
- [x] Database connection pooling
- [x] Regular backups automated
- [x] Monitoring and alerting
- [x] PM2 for process management
- [x] Log rotation configured
