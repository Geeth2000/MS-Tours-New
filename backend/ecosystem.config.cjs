module.exports = {
  apps: [
    {
      name: "mstours-backend",
      script: "./server.js",
      cwd: "/var/www/mstours/backend",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "/var/log/pm2/mstours-error.log",
      out_file: "/var/log/pm2/mstours-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      max_memory_restart: "500M",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
