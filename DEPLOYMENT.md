# Deployment Guide

This guide will help you deploy your Progress Photos application to Vercel and GitHub.

## Prerequisites

- GitHub account
- Vercel account
- Node.js 18+ installed locally

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `progress-photos` (or your preferred name)
3. Make it public or private (your choice)
4. Don't initialize with README (we already have one)

## Step 2: Push Code to GitHub

1. Initialize git in your project directory:
```bash
cd progress-photos
git init
```

2. Add all files:
```bash
git add .
```

3. Make initial commit:
```bash
git commit -m "Initial commit: Progress Photos application"
```

4. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/progress-photos.git
```

5. Push to GitHub:
```bash
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from your project directory:
```bash
vercel
```

4. Follow the prompts:
   - Link to existing project? No
   - Project name: progress-photos
   - Directory: ./
   - Override settings? No

## Step 4: Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add any required environment variables (currently none needed for basic setup)

## Step 5: Test Deployment

1. Visit your deployed URL (provided by Vercel)
2. Test photo upload functionality
3. Verify photos are organized by date
4. Test search and filter features

## Production Considerations

### File Storage

For production, consider upgrading to external storage:

1. **AWS S3**: For scalable file storage
2. **Cloudinary**: For image optimization and CDN
3. **Vercel Blob**: Vercel's own storage solution

### Database

For production, consider upgrading from SQLite:

1. **PostgreSQL**: For better performance and scalability
2. **PlanetScale**: For serverless MySQL
3. **Supabase**: For PostgreSQL with real-time features

### Security

1. Add authentication (NextAuth.js)
2. Implement rate limiting
3. Add file type validation
4. Set up CORS policies

## Monitoring and Analytics

1. **Vercel Analytics**: Built-in performance monitoring
2. **Sentry**: Error tracking and monitoring
3. **Google Analytics**: User behavior tracking

## Custom Domain

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed
4. Enable SSL certificate

## Backup Strategy

1. **Database**: Regular exports of SQLite database
2. **Files**: Regular backups of uploads folder
3. **Code**: GitHub provides automatic backup

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version compatibility
2. **File Upload Issues**: Verify file size limits
3. **Database Errors**: Ensure SQLite is properly configured

### Debugging

1. Check Vercel function logs
2. Use `vercel logs` command
3. Monitor Vercel dashboard for errors

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Security Patches**: Monitor for security updates
3. **Performance**: Monitor and optimize as needed
4. **Backups**: Regular backup of data and code

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Issues: Create issues in your repository
