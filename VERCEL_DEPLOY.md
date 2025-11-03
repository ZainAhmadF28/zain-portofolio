# 🚀 Deployment Guide ke Vercel

## 📋 Langkah-langkah Deploy Backend

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Deploy ke Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables di Vercel Dashboard

Pergi ke Vercel dashboard → Project Settings → Environment Variables dan tambahkan:

```
DATABASE_URL = postgresql://postgres.gbgfgxjjayeaaeaqyary:Zain2023110101_@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
DIRECT_URL = postgresql://postgres.gbgfgxjjayeaaeaqyary:Zain2023110101_@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET = your-generated-jwt-secret
NODE_ENV = production
```

### 5. Update Frontend Environment
Update `.env.local` dengan URL backend Vercel:
```
VITE_API_URL=https://your-project-name.vercel.app/api
```

### 6. Deploy Frontend
```bash
# Build dan deploy frontend
npm run build
vercel --prod
```

## 🔧 Custom Domain (Opsional)

1. Beli domain di Namecheap/GoDaddy
2. Di Vercel dashboard → Domains → Add domain
3. Update DNS records sesuai instruksi Vercel

## 📝 Environment Variables yang Diperlukan

### Backend (Vercel):
- `DATABASE_URL` - Supabase connection string
- `DIRECT_URL` - Supabase direct connection  
- `JWT_SECRET` - Random string untuk JWT
- `NODE_ENV` - production

### Frontend (Vercel):
- `VITE_API_URL` - URL backend Vercel

## 🎯 Hasil Deploy

Setelah deploy berhasil:
- **Backend API**: `https://your-backend.vercel.app/api`
- **Frontend**: `https://your-frontend.vercel.app`
- **Health Check**: `https://your-backend.vercel.app/api/health`

## 🛠️ Troubleshooting

### Error: Prisma Client tidak tergenerate
```bash
vercel env pull .env.local
npx prisma generate
vercel --prod
```

### Error: Database connection timeout
- Pastikan DATABASE_URL benar
- Cek Supabase connection pooling settings

### Error: CORS
- Update CORS origins di `api/index.js`
- Tambahkan domain frontend yang baru