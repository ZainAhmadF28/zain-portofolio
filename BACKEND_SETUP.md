# 🚀 Portfolio Backend Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## 📋 Setup Steps

### 1. Supabase Project Setup

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New project"
   - Choose your organization
   - Enter project name: `zain-portfolio`
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

2. **Get Database URLs:**
   - Go to Settings → Database
   - Copy the "Connection string" (this is your `DATABASE_URL`)
   - Copy the "Direct connection" URL (this is your `DIRECT_URL`)

3. **Get API Keys:**
   - Go to Settings → API
   - Copy the "Project URL" (this is your `SUPABASE_URL`)
   - Copy the "anon public" key (this is your `SUPABASE_ANON_KEY`)
   - Copy the "service_role" key (this is your `SUPABASE_SERVICE_ROLE_KEY`)

### 2. Environment Configuration

Update your `.env` file with the Supabase credentials:

```env
# Database URLs from Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Supabase Configuration
SUPABASE_URL="https://[PROJECT_ID].supabase.co"
SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# JWT Secret for admin authentication (generate a strong random string)
JWT_SECRET="your_super_secret_jwt_key_here_make_it_very_long_and_random"

# Admin credentials (change these!)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_secure_admin_password_here"

# Server configuration
PORT=3001
NODE_ENV=development
```

### 3. Database Migration

Run the following commands to set up your database:

```bash
# Push the schema to Supabase
npm run migrate

# Generate Prisma client
npm run generate

# Seed the database with initial data
npm run seed
```

### 4. Start the Development Servers

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend (Vite):**
```bash
npm run dev
```

## 🗃️ Database Schema

The backend includes the following models:

- **Admin**: Administrator accounts
- **ContactMessage**: Contact form submissions
- **Comment**: Public comments on portfolio
- **CommentReply**: Replies to comments
- **Portfolio**: Portfolio projects
- **Certificate**: Certificates and achievements

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Contact Messages
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get all messages (admin only)
- `PATCH /api/contact/:id/status` - Update message status (admin)
- `DELETE /api/contact/:id` - Delete message (admin)

### Comments
- `GET /api/comments` - Get public comments
- `POST /api/comments` - Post new comment
- `PATCH /api/comments/:id/like` - Like a comment
- `GET /api/comments/admin` - Get all comments (admin)
- `PATCH /api/comments/:id/visibility` - Toggle visibility (admin)
- `DELETE /api/comments/:id` - Delete comment (admin)

### Portfolio
- `GET /api/portfolio` - Get all projects
- `POST /api/portfolio` - Create project (admin)
- `PUT /api/portfolio/:id` - Update project (admin)
- `DELETE /api/portfolio/:id` - Delete project (admin)

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create certificate (admin)
- `PUT /api/certificates/:id` - Update certificate (admin)
- `DELETE /api/certificates/:id` - Delete certificate (admin)

## 🔧 Configuration Notes

1. **JWT Secret**: Generate a strong random string for JWT_SECRET. You can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Admin Password**: Choose a strong password for your admin account.

3. **CORS**: The backend is configured to allow requests from localhost:5173 (Vite default) in development.

## 🚀 Deployment

For production deployment:

1. Update CORS origins in `server/index.js`
2. Set NODE_ENV=production
3. Use environment variables for all sensitive data
4. Consider using connection pooling for database

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Error**: Check your DATABASE_URL and DIRECT_URL
2. **CORS Error**: Make sure the frontend URL is in the CORS configuration
3. **JWT Error**: Verify JWT_SECRET is set correctly
4. **Migration Failed**: Check if Supabase database is accessible

### Useful Commands:

```bash
# Reset database (BE CAREFUL!)
npx prisma migrate reset

# View database in browser
npm run studio

# Check database status
npx prisma db push --preview-feature
```

## 📝 Migration from JSON Files

The seed script will automatically migrate your existing data from the JSON files:
- `/public/contact-messages.json` → ContactMessage table
- `/public/comments.json` → Comment table

After confirming the migration worked, you can safely delete the JSON files.

## 🔒 Security Considerations

1. Never commit `.env` files to version control
2. Use strong passwords and JWT secrets
3. Regularly rotate API keys
4. Implement rate limiting for production
5. Use HTTPS in production
6. Validate all user inputs

## 📚 Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Run migrations and seed data
4. Test the API endpoints
5. Update frontend components to use the new API
6. Deploy to production

Happy coding! 🎉