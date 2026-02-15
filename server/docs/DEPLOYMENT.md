# Production Deployment Guide

## Prerequisites Checklist

- [ ] PostgreSQL database (cloud or self-hosted)
- [ ] Node.js 18+ on server
- [ ] Domain name (optional)
- [ ] SSL certificate (optional, recommended)

---

## Option 1: Render (Easiest)

### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard → New → PostgreSQL
2. Choose free tier or paid
3. Copy the **Internal Database URL**

### Step 2: Deploy Backend

1. Push code to GitHub
2. Render Dashboard → New → Web Service
3. Connect GitHub repository
4. Configure:
   ```
   Name: chatbot-api
   Region: Choose nearest
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install && npm run db:generate && npm run db:push
   Start Command: npm start
   ```

### Step 3: Environment Variables

Add in Render:

```env
DATABASE_URL=<your-internal-database-url>
JWT_SECRET=<random-32-char-string>
JWT_EXPIRES_IN=7d
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

**API URL**: `https://chatbot-api.onrender.com`

---

## Option 2: Railway

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Initialize Project

```bash
cd server
railway init
railway add --database postgres
```

### Step 3: Configure

Railway automatically detects Node.js. Add environment variables:

```bash
railway variables set JWT_SECRET=<random-string>
railway variables set NODE_ENV=production
railway variables set ALLOWED_ORIGINS=https://your-domain.com
```

### Step 4: Deploy

```bash
railway up
```

Railway provides:

- Automatic DATABASE_URL
- Automatic HTTPS
- Custom domain support

---

## Option 3: AWS (EC2 + RDS)

### Step 1: Create RDS PostgreSQL

1. AWS Console → RDS → Create database
2. PostgreSQL 16
3. Free tier or production tier
4. Note: endpoint, port, username, password

### Step 2: Launch EC2 Instance

1. Ubuntu 22.04 LTS
2. t2.micro (free tier) or larger
3. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom (8080) - Anywhere

### Step 3: Setup EC2

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-username/chatbot-backend.git
cd chatbot-backend/server

# Install dependencies
npm install

# Create .env
nano .env
```

### Step 4: Configure .env

```env
PORT=8080
NODE_ENV=production
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/chatbot_db
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://your-domain.com
```

### Step 5: Setup Database

```bash
npm run db:generate
npm run db:push
```

### Step 6: Start with PM2

```bash
pm2 start src/server.js --name chatbot-api
pm2 save
pm2 startup
```

### Step 7: Setup Nginx (Optional)

```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/chatbot
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Option 4: DigitalOcean

### Step 1: Create Managed PostgreSQL

1. Databases → Create → PostgreSQL 16
2. Copy connection string

### Step 2: Create Droplet

1. Ubuntu 22.04
2. $6/month or higher
3. Follow same steps as AWS EC2

### Step 3: Use App Platform (Alternative)

1. Create new app from GitHub
2. Select repository
3. Configure:
   - Type: Web Service
   - Build Command: `npm install && npm run db:generate && npm run db:push`
   - Run Command: `npm start`
4. Add database component
5. Set environment variables

---

## Option 5: Vercel (Serverless)

**Note**: Requires some modifications for serverless.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### Step 3: Deploy

```bash
cd server
vercel
```

### Step 4: Add Database

Use Vercel Postgres or external PostgreSQL.

---

## Environment Variables Reference

| Variable          | Required | Description                           | Example                               |
| ----------------- | -------- | ------------------------------------- | ------------------------------------- |
| `DATABASE_URL`    | Yes      | PostgreSQL connection string          | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`      | Yes      | Secret for JWT signing (min 32 chars) | `your-random-secret-key-xyz123`       |
| `JWT_EXPIRES_IN`  | No       | Token expiration                      | `7d` (default)                        |
| `PORT`            | No       | Server port                           | `8080` (default)                      |
| `NODE_ENV`        | Yes      | Environment                           | `production`                          |
| `ALLOWED_ORIGINS` | Yes      | CORS origins (comma-separated)        | `https://app.com,https://www.app.com` |

---

## Post-Deployment Checklist

- [ ] Test health endpoint: `GET https://your-api/health`
- [ ] Test registration: `POST https://your-api/api/v1/auth/register`
- [ ] Test login: `POST https://your-api/api/v1/auth/login`
- [ ] Test protected route: `GET https://your-api/api/v1/auth/me`
- [ ] Check database connection
- [ ] Verify CORS works with frontend
- [ ] Test error handling
- [ ] Setup monitoring (optional)
- [ ] Setup backups (recommended)
- [ ] Configure CI/CD (optional)

---

## Monitoring & Logging

### Option 1: PM2 Monitoring (Free)

```bash
pm2 install pm2-logrotate
pm2 logs chatbot-api
pm2 monit
```

### Option 2: Sentry (Error Tracking)

```bash
npm install @sentry/node
```

Add to `src/server.js`:

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Option 3: LogRocket

For session replay and monitoring.

---

## Database Backups

### Manual Backup

```bash
pg_dump -h host -U username -d chatbot_db > backup.sql
```

### Automated Backups (Cron)

```bash
crontab -e
```

Add:

```bash
0 2 * * * pg_dump -h host -U username -d chatbot_db > /backups/chatbot_$(date +\%Y\%m\%d).sql
```

### Cloud Backups

- Render: Automatic daily backups
- Railway: Automatic backups
- AWS RDS: Automated backups (configurable retention)

---

## Performance Optimization

### 1. Connection Pooling (Already configured in Prisma)

```javascript
// src/config/database.js
const prisma = new PrismaClient({
  log: ["error"],
  // Connection pooling automatic
});
```

### 2. Caching (Optional)

Install Redis:

```bash
npm install redis
```

Add caching layer for frequent queries.

### 3. Rate Limiting

```bash
npm install express-rate-limit
```

Add to `src/app.js`:

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

### 4. Compression

```bash
npm install compression
```

Add to `src/app.js`:

```javascript
import compression from "compression";
app.use(compression());
```

---

## Security Hardening

### 1. HTTPS Only (Already configured)

Helmet.js enforces HTTPS in production.

### 2. Rate Limiting (See above)

### 3. Input Sanitization

```bash
npm install express-mongo-sanitize xss-clean
```

### 4. Environment Secrets

Never commit:

- `.env` file
- Private keys
- Database passwords

Use environment variables on deployment platform.

---

## Scaling Strategy

### Horizontal Scaling

1. Deploy multiple instances
2. Use load balancer (Nginx, AWS ALB)
3. Ensure stateless application (JWT handles this)

### Database Scaling

1. Connection pooling (automatic with Prisma)
2. Read replicas for read-heavy workloads
3. Database indexes (already configured)

### Caching

1. Redis for session/token caching
2. CDN for static assets
3. Query result caching for frequent reads

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
node scripts/check-db.js

# Check DATABASE_URL format
# Should be: postgresql://username:password@host:port/database
```

### Port Issues

```bash
# Check if port is in use
lsof -i :8080

# Change PORT in .env
PORT=3000
```

### JWT Issues

```bash
# Ensure JWT_SECRET is set
echo $JWT_SECRET

# Should be minimum 32 characters
```

### CORS Issues

```bash
# Check ALLOWED_ORIGINS in .env
ALLOWED_ORIGINS=https://frontend.com,https://www.frontend.com

# Don't include trailing slash
```

---

## Rolling Updates (Zero Downtime)

### With PM2

```bash
# Deploy new code
git pull

# Install dependencies
npm install

# Reload without downtime
pm2 reload chatbot-api
```

### With Multiple Instances

```bash
pm2 start src/server.js -i max --name chatbot-api
```

---

## Cost Estimates

### Free Tier Options

- **Render**: Free PostgreSQL (limited) + Free web service (slow)
- **Railway**: $5 credit/month (good for testing)
- **Heroku**: Free tier deprecated

### Production Recommendations

- **Render**: $7/month (PostgreSQL) + $7/month (Web Service) = $14/month
- **Railway**: ~$15-20/month
- **DigitalOcean**: $12/month (App Platform) + $15/month (Database) = $27/month
- **AWS**: $15-30/month (t2.micro EC2 + db.t3.micro RDS)

---

## Support & Maintenance

### Regular Tasks

- [ ] Monitor error logs weekly
- [ ] Review database performance monthly
- [ ] Update dependencies quarterly
- [ ] Backup database weekly
- [ ] Review security patches monthly

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update all (careful)
npm update

# Update specific package
npm install package@latest

# Test after updates
npm test
```

---

## Success Checklist

After deployment, verify:

✅ API responds at public URL  
✅ Health endpoint returns 200  
✅ User can register  
✅ User can login  
✅ Token authentication works  
✅ Chat creation works  
✅ Messages are stored  
✅ CORS allows frontend  
✅ HTTPS is enabled  
✅ Errors are logged  
✅ Database backups configured

**Your API is production-ready! 🚀**
