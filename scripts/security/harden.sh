#!/bin/bash
# Security Hardening Script for Projectdes AI Academy
# ====================================================
# This script implements security best practices

set -e
set -u
set -o pipefail

# Must run as root
if [ "$EUID" -ne 0 ]; then
    echo "This script must be run as root"
    exit 1
fi

# Configuration
DEPLOY_USER="deploy"
APP_PATH="/var/www/projectdes-academy"
LOG_FILE="/var/log/projectdes-academy/hardening.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
log() {
    echo -e "${GREEN}[HARDENING]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

log "Starting security hardening at $(date)"
log "========================================="

# 1. System Updates
harden_system() {
    log "\n1. Updating System Packages"
    log "----------------------------"
    
    apt-get update
    apt-get upgrade -y
    apt-get autoremove -y
    apt-get autoclean
    
    # Install security tools
    apt-get install -y \
        ufw \
        fail2ban \
        unattended-upgrades \
        apt-listchanges \
        needrestart \
        debsums \
        rkhunter \
        chkrootkit \
        clamav \
        clamav-daemon
    
    # Enable automatic security updates
    dpkg-reconfigure -plow unattended-upgrades
    
    log "✓ System packages updated"
}

# 2. Configure Firewall
harden_firewall() {
    log "\n2. Configuring Firewall"
    log "-----------------------"
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    ufw default deny routed
    
    # Allow SSH (rate limited)
    ufw limit 22/tcp comment 'SSH rate limited'
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Allow monitoring port (localhost only)
    ufw allow from 127.0.0.1 to any port 9091 comment 'Monitoring'
    
    # Enable UFW
    ufw --force enable
    
    log "✓ Firewall configured and enabled"
}

# 3. Harden SSH
harden_ssh() {
    log "\n3. Hardening SSH Configuration"
    log "------------------------------"
    
    # Backup original config
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Apply hardened configuration
    cat > /etc/ssh/sshd_config.d/99-hardened.conf <<EOF
# Hardened SSH Configuration
Protocol 2
Port 22

# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
KerberosAuthentication no
GSSAPIAuthentication no
UsePAM yes

# User restrictions
AllowUsers $DEPLOY_USER
DenyUsers root
AllowGroups ssh-users

# Security settings
StrictModes yes
IgnoreRhosts yes
HostbasedAuthentication no
X11Forwarding no
PermitUserEnvironment no
Ciphers chacha20-poly1305@openssh.com,aes128-ctr,aes192-ctr,aes256-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org

# Connection settings
ClientAliveInterval 300
ClientAliveCountMax 2
MaxAuthTries 3
MaxSessions 10
MaxStartups 10:30:60
LoginGraceTime 60

# Logging
SyslogFacility AUTH
LogLevel VERBOSE

# Banner
Banner /etc/ssh/banner
EOF

    # Create SSH banner
    cat > /etc/ssh/banner <<EOF
******************************************************************
                            WARNING
This system is for authorized use only. All activities are logged
and monitored. Unauthorized access is strictly prohibited and will
be prosecuted to the fullest extent of the law.
******************************************************************
EOF

    # Create ssh-users group if not exists
    groupadd -f ssh-users
    usermod -a -G ssh-users "$DEPLOY_USER"
    
    # Restart SSH service
    systemctl restart sshd
    
    log "✓ SSH configuration hardened"
}

# 4. Configure Fail2ban
harden_fail2ban() {
    log "\n4. Configuring Fail2ban"
    log "-----------------------"
    
    # Configure jail for SSH
    cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = admin@projectdes.ai
action = %(action_mwl)s

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-badbots]
enabled = true
port = http,https
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noproxy]
enabled = true
port = http,https
filter = nginx-noproxy
logpath = /var/log/nginx/error.log
maxretry = 2

[nginx-noscript]
enabled = true
port = http,https
filter = nginx-noscript
logpath = /var/log/nginx/access.log
maxretry = 6
EOF

    # Start and enable fail2ban
    systemctl enable fail2ban
    systemctl restart fail2ban
    
    log "✓ Fail2ban configured"
}

# 5. Secure File Permissions
harden_permissions() {
    log "\n5. Securing File Permissions"
    log "----------------------------"
    
    # Set ownership for application files
    chown -R "$DEPLOY_USER:www-data" "$APP_PATH"
    
    # Set directory permissions
    find "$APP_PATH" -type d -exec chmod 755 {} \;
    
    # Set file permissions
    find "$APP_PATH" -type f -exec chmod 644 {} \;
    
    # Secure .env files
    find "$APP_PATH" -name "*.env*" -exec chmod 600 {} \;
    find "$APP_PATH" -name "*.env*" -exec chown "$DEPLOY_USER:$DEPLOY_USER" {} \;
    
    # Secure scripts
    find "$APP_PATH/scripts" -type f -name "*.sh" -exec chmod 750 {} \;
    
    # Secure logs
    chmod 750 /var/log/projectdes-academy
    chown -R "$DEPLOY_USER:adm" /var/log/projectdes-academy
    
    log "✓ File permissions secured"
}

# 6. Configure System Security
harden_system_security() {
    log "\n6. Configuring System Security"
    log "------------------------------"
    
    # Kernel hardening via sysctl
    cat > /etc/sysctl.d/99-hardening.conf <<EOF
# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Log Martians
net.ipv4.conf.all.log_martians = 1

# Ignore ICMP ping requests
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# SYN flood protection
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096

# Increase system file descriptor limit
fs.file-max = 65535

# Increase ephemeral IP ports
net.ipv4.ip_local_port_range = 10000 65000

# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
EOF

    # Apply sysctl settings
    sysctl -p /etc/sysctl.d/99-hardening.conf
    
    # Secure shared memory
    echo "tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0" >> /etc/fstab
    mount -o remount /run/shm
    
    log "✓ System security configured"
}

# 7. Configure Log Rotation
harden_logs() {
    log "\n7. Configuring Log Rotation"
    log "---------------------------"
    
    cat > /etc/logrotate.d/projectdes <<EOF
/var/log/projectdes-academy/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 $DEPLOY_USER adm
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/nginx/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 \$(cat /var/run/nginx.pid)
    endscript
}
EOF
    
    log "✓ Log rotation configured"
}

# 8. Setup Intrusion Detection
harden_ids() {
    log "\n8. Setting up Intrusion Detection"
    log "---------------------------------"
    
    # Configure rkhunter
    rkhunter --propupd
    
    # Configure ClamAV
    freshclam
    
    # Setup daily scans
    cat > /etc/cron.daily/security-scan <<EOF
#!/bin/bash
# Daily security scan

# Run rkhunter
rkhunter --check --skip-keypress --report-warnings-only

# Run ClamAV scan
clamscan -r /var/www/projectdes-academy --exclude-dir=node_modules --quiet --infected --log=/var/log/clamav/daily-scan.log

# Run chkrootkit
chkrootkit -q > /var/log/chkrootkit/daily.log 2>&1
EOF
    
    chmod +x /etc/cron.daily/security-scan
    
    log "✓ Intrusion detection configured"
}

# 9. Secure Database
harden_database() {
    log "\n9. Securing Database"
    log "--------------------"
    
    # PostgreSQL hardening
    if [ -f /etc/postgresql/*/main/postgresql.conf ]; then
        # Enable SSL
        sed -i "s/#ssl = off/ssl = on/" /etc/postgresql/*/main/postgresql.conf
        
        # Set strong authentication
        cat >> /etc/postgresql/*/main/pg_hba.conf <<EOF

# Require SSL for remote connections
hostssl all all 0.0.0.0/0 md5
EOF
        
        # Restart PostgreSQL
        systemctl restart postgresql
    fi
    
    log "✓ Database secured"
}

# 10. Setup Security Monitoring
harden_monitoring() {
    log "\n10. Setting up Security Monitoring"
    log "----------------------------------"
    
    # Install OSSEC (Host Intrusion Detection)
    wget -q -O - https://updates.atomicorp.com/installers/atomic | sh
    yum install -y ossec-hids ossec-hids-server || apt-get install -y ossec-hids ossec-hids-server
    
    # Configure OSSEC
    cat > /var/ossec/etc/ossec.conf <<EOF
<ossec_config>
    <global>
        <email_notification>yes</email_notification>
        <email_to>admin@projectdes.ai</email_to>
        <smtp_server>localhost</smtp_server>
        <email_from>ossec@projectdes.ai</email_from>
    </global>
    
    <syscheck>
        <frequency>3600</frequency>
        <directories check_all="yes">/var/www/projectdes-academy</directories>
        <directories check_all="yes">/etc</directories>
    </syscheck>
    
    <rootcheck>
        <frequency>3600</frequency>
    </rootcheck>
    
    <localfile>
        <log_format>syslog</log_format>
        <location>/var/log/auth.log</location>
    </localfile>
    
    <localfile>
        <log_format>syslog</log_format>
        <location>/var/log/nginx/access.log</location>
    </localfile>
</ossec_config>
EOF
    
    # Start OSSEC
    /var/ossec/bin/ossec-control start
    
    log "✓ Security monitoring configured"
}

# 11. Create Security Headers for Nginx
harden_nginx() {
    log "\n11. Hardening Nginx"
    log "-------------------"
    
    # Create security headers snippet
    cat > /etc/nginx/snippets/security-headers.conf <<EOF
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.projectdes.ai https://api.stripe.com wss://ws.projectdes.ai;" always;

# Hide Nginx version
server_tokens off;
more_clear_headers Server;

# Prevent clickjacking
add_header X-Frame-Options DENY;

# Enable HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
EOF
    
    # Test and reload Nginx
    nginx -t && systemctl reload nginx
    
    log "✓ Nginx hardened"
}

# 12. Backup Configuration
harden_backup() {
    log "\n12. Setting up Secure Backups"
    log "-----------------------------"
    
    # Create backup script
    cat > /usr/local/bin/secure-backup.sh <<'EOF'
#!/bin/bash
# Secure backup script

BACKUP_DIR="/var/backups/projectdes-academy"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.tar.gz.enc"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create encrypted backup
tar czf - /var/www/projectdes-academy \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' | \
    openssl enc -aes-256-cbc -salt -pass pass:$BACKUP_PASSWORD > "$BACKUP_FILE"

# Upload to remote storage (configure as needed)
# aws s3 cp "$BACKUP_FILE" s3://backup-bucket/

# Keep only last 7 local backups
find "$BACKUP_DIR" -name "backup-*.tar.gz.enc" -mtime +7 -delete
EOF
    
    chmod 750 /usr/local/bin/secure-backup.sh
    
    # Add to crontab
    echo "0 2 * * * /usr/local/bin/secure-backup.sh" | crontab -
    
    log "✓ Secure backups configured"
}

# Run all hardening functions
harden_system
harden_firewall
harden_ssh
harden_fail2ban
harden_permissions
harden_system_security
harden_logs
harden_ids
harden_database
harden_monitoring
harden_nginx
harden_backup

log "\n========================================="
log "Security Hardening Completed Successfully!"
log "========================================="
log ""
log "Next steps:"
log "1. Run security audit: ./scripts/security/security-audit.sh"
log "2. Review firewall rules: ufw status verbose"
log "3. Check fail2ban status: fail2ban-client status"
log "4. Monitor logs: tail -f /var/log/projectdes-academy/security.log"
log ""
log "IMPORTANT: Reboot the system to apply all changes"