#!/bin/bash

# MS-Tours Deployment Script
# Run this on your DigitalOcean droplet

set -e

echo "🚀 Starting MS-Tours Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
APP_DIR="/var/www/mstours"
REPO_URL="https://github.com/YOUR_USERNAME/MS-Tours-New.git"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo -e "${YELLOW}Step 3: Installing MongoDB...${NC}"
if ! command -v mongod &> /dev/null; then
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt update
    apt install -y mongodb-org
fi
systemctl start mongod
systemctl enable mongod

echo -e "${YELLOW}Step 4: Installing Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx

echo -e "${YELLOW}Step 5: Installing PM2...${NC}"
npm install -g pm2
pm2 startup systemd -u root --hp /root

echo -e "${YELLOW}Step 6: Setting up application directory...${NC}"
mkdir -p $APP_DIR
mkdir -p /var/log/pm2

if [ -d "$APP_DIR/.git" ]; then
    echo "Repository exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    echo "Cloning repository..."
    git clone $REPO_URL $APP_DIR
fi

echo -e "${YELLOW}Step 7: Setting up Backend...${NC}"
cd $APP_DIR/backend
npm install --production

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${RED}IMPORTANT: Edit $APP_DIR/backend/.env with your production values!${NC}"
fi

echo -e "${YELLOW}Step 8: Building Frontend...${NC}"
cd $APP_DIR/frontend
npm install
npm run build

echo -e "${YELLOW}Step 9: Configuring Nginx...${NC}"
rm -f /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/mstours << 'EOF'
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
EOF

ln -sf /etc/nginx/sites-available/mstours /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

echo -e "${YELLOW}Step 10: Starting Backend with PM2...${NC}"
cd $APP_DIR/backend
pm2 delete mstours-backend 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save

echo -e "${YELLOW}Step 11: Setting up Firewall...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${YELLOW}Important next steps:${NC}"
echo "1. Edit $APP_DIR/backend/.env with your production values"
echo "2. Restart backend: pm2 restart mstours-backend"
echo "3. (Optional) Seed database: cd $APP_DIR/backend && npm run seed"
echo ""
echo -e "${GREEN}Your site is available at: http://143.110.177.75${NC}"
