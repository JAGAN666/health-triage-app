# 🚀 GitHub Hosting Guide for HealthTriage AI

This guide will walk you through hosting your HealthTriage AI application on GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js 18+ installed

## 🔧 Step-by-Step Setup

### 1. Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it `health-triage-app` (or your preferred name)
5. Make it **Public** (required for GitHub Pages)
6. Don't initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 2. Connect Your Local Repository to GitHub

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/health-triage-app.git

# Verify the remote was added
git remote -v
```

### 3. Prepare Your Code for GitHub Pages

The app is already configured for static export. Key changes made:

- **Next.js Config**: Set to export static files
- **Base Path**: Configured for repository name
- **Image Optimization**: Disabled for static export
- **Trailing Slash**: Enabled for GitHub Pages compatibility

### 4. Commit and Push Your Code

```bash
# Add all files (excluding those in .gitignore)
git add .

# Commit your changes
git commit -m "Initial commit: HealthTriage AI app ready for GitHub Pages"

# Push to GitHub
git push -u origin main
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/(root)** folder
6. Click **Save**

### 6. Configure Environment Variables (Optional)

For production deployment, you may want to set up environment variables:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXTAUTH_URL`: Your GitHub Pages URL

## 🌐 Access Your App

Your app will be available at:
```
https://YOUR_USERNAME.github.io/health-triage-app/
```

**Note**: It may take a few minutes for the first deployment to complete.

## 🔄 Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will:

- Build your app automatically on every push to main
- Run tests and quality checks
- Prepare deployment artifacts

## 📱 Features Available on GitHub Pages

✅ **Static Pages**: All main pages work perfectly
✅ **Responsive Design**: Mobile and desktop optimized
✅ **UI Components**: All React components function
✅ **Styling**: Tailwind CSS and animations work
✅ **Navigation**: Client-side routing works

⚠️ **Limitations**:
- No server-side API routes (triage, auth, etc.)
- No database connections
- No real-time features

## 🛠️ Local Development vs GitHub Pages

| Feature | Local Dev | GitHub Pages |
|---------|-----------|--------------|
| Full API | ✅ | ❌ |
| Database | ✅ | ❌ |
| Authentication | ✅ | ❌ |
| Real-time | ✅ | ❌ |
| Static Pages | ✅ | ✅ |
| Responsive UI | ✅ | ✅ |
| Animations | ✅ | ✅ |

## 🔧 Troubleshooting

### Build Errors
```bash
# Clean and rebuild
rm -rf .next out
npm run build
```

### GitHub Pages Not Loading
- Check repository is public
- Verify Pages source is set to main branch
- Wait 5-10 minutes for deployment
- Check Actions tab for build status

### Environment Variables
- Remember: GitHub Pages is static, no server-side env vars
- Use client-side configuration for public values
- Keep sensitive data in GitHub Secrets

## 🚀 Next Steps

1. **Custom Domain**: Add your own domain in Pages settings
2. **Analytics**: Integrate Google Analytics or similar
3. **CDN**: Use Cloudflare or similar for better performance
4. **Backend**: Deploy API routes to Vercel, Netlify, or similar

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify all files are committed
3. Ensure repository is public
4. Check GitHub Pages settings

---

**Happy Hosting! 🎉**

Your HealthTriage AI app is now accessible to the world through GitHub Pages.
