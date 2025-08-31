#!/bin/bash
# Security Audit Script for Projectdes AI Academy
# ================================================

set -e
set -u
set -o pipefail

# Configuration
REPORT_DIR="/var/log/projectdes-academy/security"
REPORT_FILE="$REPORT_DIR/audit-$(date +'%Y%m%d-%H%M%S').log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Severity levels
CRITICAL=0
HIGH=0
MEDIUM=0
LOW=0

# Create report directory
mkdir -p "$REPORT_DIR"

# Logging functions
log() {
    echo -e "${GREEN}[AUDIT]${NC} $1" | tee -a "$REPORT_FILE"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$REPORT_FILE"
    ((MEDIUM++))
}

error() {
    echo -e "${RED}[CRITICAL]${NC} $1" | tee -a "$REPORT_FILE"
    ((CRITICAL++))
}

# Start audit
log "Starting security audit at $(date)"
log "========================================="

# 1. Check SSL certificates
check_ssl() {
    log "\n1. SSL Certificate Check"
    log "------------------------"
    
    for domain in projectdes.ai api.projectdes.ai ws.projectdes.ai; do
        if command -v openssl &> /dev/null; then
            expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep notAfter | cut -d= -f2)
            
            if [ -n "$expiry" ]; then
                expiry_epoch=$(date -d "$expiry" +%s)
                current_epoch=$(date +%s)
                days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
                
                if [ "$days_left" -lt 7 ]; then
                    error "SSL certificate for $domain expires in $days_left days!"
                elif [ "$days_left" -lt 30 ]; then
                    warn "SSL certificate for $domain expires in $days_left days"
                else
                    log "✓ SSL certificate for $domain valid for $days_left days"
                fi
            else
                error "Could not check SSL certificate for $domain"
            fi
        fi
    done
}

# 2. Check file permissions
check_permissions() {
    log "\n2. File Permission Check"
    log "------------------------"
    
    # Check for world-writable files
    world_writable=$(find /var/www/projectdes-academy -type f -perm -002 2>/dev/null | wc -l)
    if [ "$world_writable" -gt 0 ]; then
        warn "Found $world_writable world-writable files"
        find /var/www/projectdes-academy -type f -perm -002 -exec ls -la {} \; >> "$REPORT_FILE" 2>/dev/null
    else
        log "✓ No world-writable files found"
    fi
    
    # Check .env file permissions
    for env_file in $(find /var/www/projectdes-academy -name "*.env*" 2>/dev/null); do
        perms=$(stat -c %a "$env_file")
        if [ "$perms" != "600" ] && [ "$perms" != "640" ]; then
            error "Insecure permissions on $env_file: $perms (should be 600 or 640)"
        else
            log "✓ Secure permissions on $env_file: $perms"
        fi
    done
    
    # Check SSH key permissions
    if [ -d ~/.ssh ]; then
        for key in ~/.ssh/*; do
            if [[ "$key" == *.pub ]]; then
                continue
            fi
            if [ -f "$key" ]; then
                perms=$(stat -c %a "$key")
                if [ "$perms" != "600" ] && [ "$perms" != "400" ]; then
                    error "Insecure SSH key permissions on $key: $perms"
                fi
            fi
        done
    fi
}

# 3. Check for exposed secrets
check_secrets() {
    log "\n3. Secret Exposure Check"
    log "------------------------"
    
    # Check for hardcoded secrets
    patterns=(
        "password.*=.*['\"].*['\"]"
        "api[_-]?key.*=.*['\"].*['\"]"
        "secret.*=.*['\"].*['\"]"
        "token.*=.*['\"].*['\"]"
        "private[_-]?key"
        "BEGIN RSA PRIVATE KEY"
        "aws_access_key_id"
        "stripe_secret_key"
    )
    
    for pattern in "${patterns[@]}"; do
        matches=$(grep -r -i "$pattern" /var/www/projectdes-academy --exclude-dir=node_modules --exclude-dir=.git --exclude="*.env*" 2>/dev/null | wc -l)
        if [ "$matches" -gt 0 ]; then
            warn "Found $matches potential hardcoded secrets matching pattern: $pattern"
        fi
    done
    
    # Check Git history for secrets
    if [ -d /var/www/projectdes-academy/.git ]; then
        cd /var/www/projectdes-academy
        if command -v git-secrets &> /dev/null; then
            git secrets --scan 2>/dev/null || warn "Git secrets scan found issues"
        fi
    fi
}

# 4. Check open ports
check_ports() {
    log "\n4. Open Ports Check"
    log "-------------------"
    
    expected_ports="22 80 443 3000 5000"
    
    if command -v netstat &> /dev/null; then
        open_ports=$(netstat -tuln | grep LISTEN | awk '{print $4}' | rev | cut -d: -f1 | rev | sort -u)
        
        for port in $open_ports; do
            if [[ ! " $expected_ports " =~ " $port " ]]; then
                warn "Unexpected port open: $port"
            else
                log "✓ Expected port open: $port"
            fi
        done
    fi
}

# 5. Check firewall rules
check_firewall() {
    log "\n5. Firewall Check"
    log "-----------------"
    
    if command -v ufw &> /dev/null; then
        if ufw status | grep -q "Status: active"; then
            log "✓ UFW firewall is active"
            ufw status numbered >> "$REPORT_FILE"
        else
            error "UFW firewall is not active!"
        fi
    elif command -v iptables &> /dev/null; then
        rules=$(iptables -L -n | wc -l)
        if [ "$rules" -gt 10 ]; then
            log "✓ iptables has $rules rules configured"
        else
            warn "iptables has only $rules rules (might be misconfigured)"
        fi
    else
        error "No firewall detected!"
    fi
}

# 6. Check system updates
check_updates() {
    log "\n6. System Updates Check"
    log "-----------------------"
    
    if command -v apt &> /dev/null; then
        updates=$(apt list --upgradable 2>/dev/null | grep -c upgradable || echo 0)
        security_updates=$(apt list --upgradable 2>/dev/null | grep -c security || echo 0)
        
        if [ "$security_updates" -gt 0 ]; then
            error "$security_updates security updates available!"
        elif [ "$updates" -gt 0 ]; then
            warn "$updates system updates available"
        else
            log "✓ System is up to date"
        fi
    fi
}

# 7. Check user accounts
check_users() {
    log "\n7. User Account Check"
    log "---------------------"
    
    # Check for users with empty passwords
    empty_pass=$(awk -F: '($2 == "" || $2 == "!") {print $1}' /etc/shadow 2>/dev/null | wc -l)
    if [ "$empty_pass" -gt 0 ]; then
        error "Found $empty_pass users with empty passwords!"
    else
        log "✓ No users with empty passwords"
    fi
    
    # Check for users with UID 0 (root privileges)
    root_users=$(awk -F: '($3 == 0) {print $1}' /etc/passwd | grep -v "^root$" | wc -l)
    if [ "$root_users" -gt 0 ]; then
        error "Found $root_users non-root users with UID 0!"
    else
        log "✓ Only root has UID 0"
    fi
    
    # Check sudo users
    if [ -f /etc/sudoers ]; then
        sudo_users=$(grep -v "^#" /etc/sudoers | grep -c "ALL=(ALL)" || echo 0)
        log "Found $sudo_users sudo users"
    fi
}

# 8. Check SSH configuration
check_ssh() {
    log "\n8. SSH Configuration Check"
    log "--------------------------"
    
    if [ -f /etc/ssh/sshd_config ]; then
        # Check if root login is disabled
        if grep -q "^PermitRootLogin no" /etc/ssh/sshd_config; then
            log "✓ Root login disabled"
        else
            error "Root login is not disabled!"
        fi
        
        # Check if password authentication is disabled
        if grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config; then
            log "✓ Password authentication disabled"
        else
            warn "Password authentication is enabled"
        fi
        
        # Check SSH protocol version
        if grep -q "^Protocol 2" /etc/ssh/sshd_config; then
            log "✓ SSH Protocol 2 enforced"
        fi
    else
        error "SSH configuration file not found!"
    fi
}

# 9. Check database security
check_database() {
    log "\n9. Database Security Check"
    log "--------------------------"
    
    if command -v psql &> /dev/null; then
        # Check for default postgres password
        PGPASSWORD=postgres psql -U postgres -h localhost -c "SELECT 1" &>/dev/null
        if [ $? -eq 0 ]; then
            error "PostgreSQL using default password!"
        else
            log "✓ PostgreSQL not using default password"
        fi
        
        # Check SSL enforcement
        ssl_enabled=$(psql "$DATABASE_URL" -c "SHOW ssl" -t 2>/dev/null | tr -d ' ')
        if [ "$ssl_enabled" = "on" ]; then
            log "✓ PostgreSQL SSL enabled"
        else
            warn "PostgreSQL SSL not enabled"
        fi
    fi
}

# 10. Check application security headers
check_headers() {
    log "\n10. Security Headers Check"
    log "--------------------------"
    
    headers=(
        "X-Frame-Options"
        "X-Content-Type-Options"
        "X-XSS-Protection"
        "Strict-Transport-Security"
        "Content-Security-Policy"
    )
    
    for header in "${headers[@]}"; do
        if curl -s -I https://projectdes.ai | grep -qi "$header"; then
            log "✓ $header header present"
        else
            warn "$header header missing"
        fi
    done
}

# 11. Check for common vulnerabilities
check_vulnerabilities() {
    log "\n11. Vulnerability Check"
    log "-----------------------"
    
    # Check Node.js vulnerabilities
    cd /var/www/projectdes-academy
    if command -v pnpm &> /dev/null; then
        vulns=$(pnpm audit --json 2>/dev/null | grep -c '"severity":"critical"' || echo 0)
        if [ "$vulns" -gt 0 ]; then
            error "Found $vulns critical npm vulnerabilities!"
        else
            log "✓ No critical npm vulnerabilities"
        fi
    fi
    
    # Check for known vulnerable packages
    vulnerable_packages=(
        "express@3"
        "express@4.0"
        "jsonwebtoken@0"
        "bcrypt@1"
    )
    
    for pkg in "${vulnerable_packages[@]}"; do
        if grep -q "$pkg" package.json 2>/dev/null; then
            error "Found vulnerable package: $pkg"
        fi
    done
}

# 12. Check logging and monitoring
check_monitoring() {
    log "\n12. Logging & Monitoring Check"
    log "------------------------------"
    
    # Check if logs are being rotated
    if [ -f /etc/logrotate.d/projectdes ]; then
        log "✓ Log rotation configured"
    else
        warn "Log rotation not configured"
    fi
    
    # Check if monitoring is active
    if pgrep -f monitor.js > /dev/null; then
        log "✓ Monitoring script running"
    else
        warn "Monitoring script not running"
    fi
    
    # Check log file sizes
    large_logs=$(find /var/log -type f -size +100M 2>/dev/null | wc -l)
    if [ "$large_logs" -gt 0 ]; then
        warn "Found $large_logs large log files (>100MB)"
    fi
}

# Run all checks
check_ssl
check_permissions
check_secrets
check_ports
check_firewall
check_updates
check_users
check_ssh
check_database
check_headers
check_vulnerabilities
check_monitoring

# Generate summary
log "\n========================================="
log "Security Audit Summary"
log "========================================="
log "Critical Issues: $CRITICAL"
log "High Issues: $HIGH"
log "Medium Issues: $MEDIUM"
log "Low Issues: $LOW"
log "Report saved to: $REPORT_FILE"

# Exit with appropriate code
if [ "$CRITICAL" -gt 0 ]; then
    exit 2
elif [ "$HIGH" -gt 0 ]; then
    exit 1
else
    exit 0
fi