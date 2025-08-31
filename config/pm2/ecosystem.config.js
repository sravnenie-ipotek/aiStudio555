// PM2 Configuration for Production Deployment
// ============================================

module.exports = {
  apps: [
    // API Application
    {
      name: 'projectdes-api',
      script: 'dist/server.js',
      cwd: '/var/www/projectdes-academy/apps/api',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Performance & Reliability
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Logging
      error_file: '/var/log/pm2/projectdes-api-error.log',
      out_file: '/var/log/pm2/projectdes-api-out.log',
      log_file: '/var/log/pm2/projectdes-api-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Monitoring
      instance_var: 'INSTANCE_ID',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'tmp'],
      
      // Graceful Shutdown
      shutdown_with_message: true,
      kill_signal: 'SIGTERM',
      
      // Health Check
      health_check: {
        interval: 30,
        path: '/health',
        port: 5000,
      },
      
      // Auto-restart
      autorestart: true,
      cron_restart: '0 4 * * *', // Daily restart at 4 AM
    },
    
    // Web Application (Next.js)
    {
      name: 'projectdes-web',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/projectdes-academy/apps/web',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Performance & Reliability
      max_memory_restart: '1.5G',
      min_uptime: '10s',
      max_restarts: 10,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Logging
      error_file: '/var/log/pm2/projectdes-web-error.log',
      out_file: '/var/log/pm2/projectdes-web-out.log',
      log_file: '/var/log/pm2/projectdes-web-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Monitoring
      instance_var: 'INSTANCE_ID',
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs', 'tmp'],
      
      // Graceful Shutdown
      shutdown_with_message: true,
      kill_signal: 'SIGTERM',
      
      // Auto-restart
      autorestart: true,
      cron_restart: '0 4 * * *', // Daily restart at 4 AM
    },
    
    // Background Jobs Worker
    {
      name: 'projectdes-worker',
      script: 'dist/worker.js',
      cwd: '/var/www/projectdes-academy/apps/api',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'background',
      },
      env_production: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'background',
      },
      // Performance & Reliability
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      
      // Logging
      error_file: '/var/log/pm2/projectdes-worker-error.log',
      out_file: '/var/log/pm2/projectdes-worker-out.log',
      log_file: '/var/log/pm2/projectdes-worker-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart
      autorestart: true,
      cron_restart: '0 5 * * *', // Daily restart at 5 AM
    },
    
    // Monitoring Service
    {
      name: 'projectdes-monitor',
      script: 'scripts/monitor.js',
      cwd: '/var/www/projectdes-academy',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      // Logging
      error_file: '/var/log/pm2/projectdes-monitor-error.log',
      out_file: '/var/log/pm2/projectdes-monitor-out.log',
      time: true,
      
      // Auto-restart
      autorestart: true,
      max_restarts: 5,
    },
  ],
  
  // Deploy Configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['server1.projectdes.ai', 'server2.projectdes.ai'],
      ref: 'origin/main',
      repo: 'git@github.com:projectdes/academy.git',
      path: '/var/www/projectdes-academy',
      'pre-deploy': 'git fetch --all',
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'echo "Setting up production server..."',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      env: {
        NODE_ENV: 'production',
      },
    },
    
    staging: {
      user: 'deploy',
      host: 'staging.projectdes.ai',
      ref: 'origin/develop',
      repo: 'git@github.com:projectdes/academy.git',
      path: '/var/www/projectdes-academy-staging',
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};

// PM2 Commands Reference:
// =======================
// Start all apps: pm2 start ecosystem.config.js --env production
// Start specific app: pm2 start ecosystem.config.js --only projectdes-api
// Reload with zero downtime: pm2 reload ecosystem.config.js
// Monitor: pm2 monit
// Logs: pm2 logs [app-name]
// Save current process list: pm2 save
// Resurrect saved process list: pm2 resurrect
// Generate startup script: pm2 startup
// Deploy: pm2 deploy production setup && pm2 deploy production