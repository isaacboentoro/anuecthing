# TikTok OAuth Setup Guide

## Getting Started with TikTok API

To use real TikTok data instead of mock data, you'll need to set up OAuth 2.0 credentials with TikTok.

### Step 1: Create a TikTok Developer Account
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Sign up or log in with your TikTok account
3. Complete the developer verification process

### Step 2: Create a New App
1. In the developer dashboard, click "Create an App"
2. Fill in your app details:
   - App name: Your app name
   - App description: Brief description of your app
   - Category: Select appropriate category
3. Submit for review (this may take a few days)

### Step 3: Get Your Credentials
Once your app is approved:
1. Go to your app dashboard
2. Find the "Client Key" and "Client Secret"
3. Copy these values

### Step 4: Configure Environment Variables
Create a `.env.local` file in your project root with:

```env
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
```

### Step 5: Request API Access
For trending content and research endpoints, you may need to:
1. Apply for "Research API" access in your TikTok developer dashboard
2. Provide justification for your use case
3. Wait for approval (can take several weeks)

## API Endpoints Used
- `/v2/research/trending/videos/` - Get trending videos
- `/v2/research/trending/hashtags/` - Get trending hashtags
- `/v2/research/video/query/` - Search videos

## Authentication Flow
The app uses OAuth 2.0 Client Credentials flow:
1. Exchanges client key/secret for access token
2. Uses access token for API requests
3. Automatically refreshes token when expired

## Fallback Behavior
If credentials are not configured or API calls fail, the app will automatically use realistic mock data for development and testing.

## Rate Limits
TikTok API has rate limits. The current implementation:
- Caches access tokens to minimize token requests
- Includes error handling for rate limit responses
- Falls back to mock data if limits are exceeded

## Troubleshooting
- Ensure your app has the required permissions for Research API
- Check that your client credentials are correct
- Verify your app is approved and active
- Monitor the browser console for detailed error messages