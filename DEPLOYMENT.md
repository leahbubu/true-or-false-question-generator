# Deployment Guide

This guide covers deploying the True/False Question Generator application to production.

## Architecture Overview

This is a full-stack application with two parts:
- **Frontend**: React SPA that can be hosted on GitHub Pages
- **Backend**: Express API server that needs Node.js hosting

## Frontend Deployment (GitHub Pages)

### Automatic Deployment with GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

#### Setup Steps:

1. **Enable GitHub Pages** in your repository:
   - Go to repository Settings → Pages
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"

2. **Push to main branch**:
   ```bash
   git checkout main
   git merge claude/true-false-quiz-generator-011CURJPcVanDKzsh9JKVc2e
   git push origin main
   ```

3. **Wait for deployment**:
   - Go to the "Actions" tab in your GitHub repository
   - Wait for the "Deploy to GitHub Pages" workflow to complete
   - Your site will be live at: `https://yourusername.github.io/true-or-false-question-generator/`

### Manual Deployment

If you prefer manual deployment:

1. **Build the frontend**:
   ```bash
   cd client
   npm run build:gh-pages
   ```

2. **Deploy using gh-pages** (install if needed):
   ```bash
   npm install -g gh-pages
   gh-pages -d client/dist
   ```

## Backend Deployment

The backend needs to be deployed to a Node.js hosting service. Here are popular options:

### Option 1: Railway.app (Recommended - Free Tier Available)

1. **Sign up** at [railway.app](https://railway.app)

2. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure the deployment**:
   - Root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

4. **Add environment variables**:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `PORT`: 3001 (Railway will override this)
   - `CLIENT_URL`: Your GitHub Pages URL
   - `NODE_ENV`: production

5. **Deploy**: Railway will automatically deploy your backend

6. **Get your backend URL**: Copy the Railway-provided URL (e.g., `https://your-app.railway.app`)

### Option 2: Render.com (Free Tier Available)

1. **Sign up** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Name: `true-false-quiz-backend`
   - Root directory: `server`
   - Environment: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

3. **Add environment variables** (same as Railway above)

4. **Deploy**: Render will build and deploy automatically

### Option 3: Heroku

1. **Install Heroku CLI** and login:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create a new Heroku app**:
   ```bash
   heroku create your-quiz-backend
   ```

3. **Add a Procfile** in the server directory:
   ```
   web: npm start
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set ANTHROPIC_API_KEY=your_api_key_here
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**:
   ```bash
   git subtree push --prefix server heroku main
   ```

### Option 4: Vercel (Serverless)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`** in server directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/index.ts"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   cd server
   vercel
   ```

4. **Set environment variables** in Vercel dashboard

## Connecting Frontend to Backend

After deploying the backend, you need to configure the frontend to use it:

### For GitHub Pages:

1. **Create `.env.production`** in the `client` directory:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Update the GitHub Actions workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   - name: Build client
     env:
       GITHUB_PAGES: 'true'
       VITE_API_URL: https://your-backend-url.railway.app/api
     run: npm run build --workspace=client
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Configure production API URL"
   git push origin main
   ```

### Update Backend CORS

Update your backend's `.env` file to allow requests from GitHub Pages:

```env
CLIENT_URL=https://yourusername.github.io
```

For multiple origins, update `server/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://yourusername.github.io'
  ],
  credentials: true
}));
```

## Complete Deployment Checklist

- [ ] Deploy backend to Railway/Render/Heroku/Vercel
- [ ] Set all environment variables on backend host
- [ ] Get backend URL
- [ ] Update frontend environment variables with backend URL
- [ ] Update backend CORS settings
- [ ] Enable GitHub Pages in repository settings
- [ ] Push to main branch to trigger deployment
- [ ] Test the deployed application
- [ ] Verify all features work (text, URL, PDF, YouTube)

## Environment Variables Reference

### Backend (.env in server directory)
```env
PORT=3001
NODE_ENV=production
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLIENT_URL=https://yourusername.github.io
```

### Frontend (.env.production in client directory)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Testing Deployment

After deployment, test all features:

1. Visit your GitHub Pages URL
2. Test text input generation
3. Test URL extraction (try: https://en.wikipedia.org/wiki/Artificial_intelligence)
4. Test PDF upload
5. Test YouTube transcript (try a video with captions)
6. Verify explanations are showing
7. Test quiz functionality
8. Test export feature

## Troubleshooting

### Frontend Issues

**Problem**: Page shows 404 or blank screen
- **Solution**: Check that GitHub Pages is enabled and workflow completed successfully
- Verify the `base` path in `vite.config.ts` matches your repository name

**Problem**: API calls failing
- **Solution**: Check browser console for CORS errors
- Verify `VITE_API_URL` is set correctly
- Ensure backend CORS allows your frontend URL

### Backend Issues

**Problem**: 500 errors
- **Solution**: Check backend logs
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check that all dependencies are installed

**Problem**: CORS errors
- **Solution**: Update `CLIENT_URL` environment variable
- Ensure CORS middleware is configured correctly

## Monitoring

- **Frontend**: Use browser DevTools console for errors
- **Backend**: Check hosting platform logs:
  - Railway: View logs in dashboard
  - Render: Check logs tab
  - Heroku: `heroku logs --tail`

## Updating the Application

To update after changes:

1. **Backend**: Push to main branch (hosting will auto-deploy)
2. **Frontend**: Push to main branch (GitHub Actions will auto-deploy)

## Cost Considerations

- **GitHub Pages**: Free for public repositories
- **Railway**: Free tier includes 500 hours/month + $5 credit
- **Render**: Free tier available (spins down after inactivity)
- **Heroku**: Paid plans starting at $7/month
- **Vercel**: Free tier available with limitations
- **Anthropic API**: Pay per use (check pricing at anthropic.com)

## Security Notes

1. **Never commit API keys** to the repository
2. **Use environment variables** for all secrets
3. **Enable rate limiting** on backend for production
4. **Set up monitoring** for API usage and costs

---

For questions or issues, refer to the main README.md or open an issue on GitHub.
