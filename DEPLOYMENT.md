# MS-Tours Production Deployment Guide

## Server: DigitalOcean Droplet

**IP Address:** 143.110.177.75

---

## Prerequisites

SSH into your droplet:

```bash
ssh root@143.110.177.75
```

### 1. Update System

```bash
apt update && apt upgrade -y
```

### 2. Install Node.js (v20 LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node -v && npm -v
```

### 3. Install MongoDB

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
systemctl status mongod
```

### 4. Install Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 5. Install PM2

```bash
npm install -g pm2
pm2 startup systemd
```

### 6. Install Git

```bash
apt install -y git
```

---

## Deployment Steps

### 1. Create Application Directory

```bash
mkdir -p /var/www/mstours
cd /var/www/mstours
```

### 2. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/MS-Tours-New.git .
# Or if private:
# git clone https://USER:TOKEN@github.com/YOUR_USERNAME/MS-Tours-New.git .
```

### 3. Setup Backend

```bash
cd /var/www/mstours/backend

# Install dependencies
npm install --production

# Create environment file
cp .env.example .env
nano .env
```

Edit `.env` with your production values:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/mstours
JWT_SECRET=YOUR_STRONG_JWT_SECRET_HERE
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://143.110.177.75,http://localhost:5173
ANTHROPIC_API_KEY=your_anthropic_api_key
```

**Generate a strong JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Setup Frontend

```bash
cd /var/www/mstours/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 5. Configure Nginx

```bash
# Remove default config
rm /etc/nginx/sites-enabled/default

# Create new config
nano /etc/nginx/sites-available/mstours
```

Copy content from `frontend/nginx.conf.txt` or use this:

```nginx
server {
    listen 80;
    server_name 143.110.177.75;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";

    location / {
        root   /var/www/mstours/frontend/dist;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/mstours /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 6. Start Backend with PM2

```bash
cd /var/www/mstours/backend

# Create PM2 log directory
mkdir -p /var/log/pm2

# Start with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 process list
pm2 save

# View logs
pm2 logs mstours-backend
```

### 7. Seed Database (Optional)

```bash
cd /var/www/mstours/backend
npm run seed
```

---

## Verification

1. **Check Backend:**

   ```bash
   curl http://localhost:5000
   # Should return: {"success":true,"message":"M&S Tours API"}
   ```

2. **Check Frontend:**
   Open browser: `http://143.110.177.75`

3. **Check API via Nginx:**
   ```bash
   curl http://143.110.177.75/api/v1/tours
   ```

---

## Useful Commands

### PM2 Commands

```bash
pm2 status                    # Check status
pm2 logs mstours-backend      # View logs
pm2 restart mstours-backend   # Restart app
pm2 stop mstours-backend      # Stop app
pm2 delete mstours-backend    # Remove from PM2
pm2 monit                     # Monitor dashboard
```

### Nginx Commands

```bash
nginx -t                      # Test config
systemctl restart nginx       # Restart
systemctl status nginx        # Check status
tail -f /var/log/nginx/error.log  # View errors
```

### MongoDB Commands

```bash
systemctl status mongod       # Check status
mongosh                       # Open shell
mongosh mstours               # Connect to database
```

---

## Updating the Application

```bash
cd /var/www/mstours

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart mstours-backend

# Update frontend
cd ../frontend
npm install
npm run build

# No need to restart nginx for frontend
```

---

## Firewall Setup (UFW)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## SSL Certificate (Optional - For Domain)

If you add a domain later:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## Troubleshooting

### Backend not starting

```bash
pm2 logs mstours-backend --lines 50
cat /var/log/pm2/mstours-error.log
```

### Nginx errors

```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### MongoDB connection issues

```bash
systemctl status mongod
cat /var/log/mongodb/mongod.log
```

### Check ports

```bash
netstat -tlnp | grep -E '80|5000|27017'
```

---

## Application URLs

- **Frontend:** http://143.110.177.75
- **Backend API:** http://143.110.177.75/api/v1
- **Health Check:** http://143.110.177.75/api/v1

---

## Security Recommendations

1. Change default MongoDB port and add authentication
2. Use a strong JWT secret
3. Set up fail2ban for SSH protection
4. Use HTTPS with Let's Encrypt when you have a domain
5. Keep system and packages updated
