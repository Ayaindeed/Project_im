# Google OAuth Configuration Guide

## Overview
Google OAuth has been implemented for the InternMatch application. This guide will help you configure the Google OAuth credentials.

## 🛠️ Setup Steps

### 1. Google Cloud Console Setup

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Name it something like "InternMatch OAuth"

2. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "People API" for profile information

3. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields:
     - App name: "InternMatch"
     - User support email: your email
     - Developer contact email: your email
   - Add scopes: `email`, `profile`
   - Add test users during development

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "InternMatch Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

### 2. Environment Configuration

Replace the placeholder values in `backend/.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
SESSION_SECRET=your-secure-session-secret-min-32-chars
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Keep your `GOOGLE_CLIENT_SECRET` secure and never commit it to version control
- Generate a strong `SESSION_SECRET` (minimum 32 characters)
- Update `FRONTEND_URL` for production deployment

### 3. Testing the Integration

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test OAuth Flow:**
   - Navigate to login page
   - Click "Continuer avec Google" button
   - Complete Google authentication
   - Verify successful login and redirect

## 🔧 Implementation Details

### Components Created:
- `GoogleAuthButton.js` - OAuth login button with Google styling
- `GoogleAuthSuccess.js` - Handles OAuth callback and token management
- OAuth integration in `Login.js` and `Register.js`

### Backend Routes:
- `GET /api/auth/google` - Initiates OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback
- `GET /api/auth/google/failure` - Handles OAuth errors

### Features:
- ✅ Automatic user creation for new Google users
- ✅ Account linking for existing users
- ✅ Role-based dashboard redirection
- ✅ Error handling and user feedback
- ✅ JWT token generation and storage
- ✅ Responsive design with Google branding

## 🚨 Security Notes

1. **Environment Variables:**
   - Never commit `.env` file with real credentials
   - Use different credentials for development/production
   - Rotate secrets regularly

2. **Redirect URIs:**
   - Only add trusted domains to authorized redirect URIs
   - Use HTTPS in production
   - Validate all redirects on the backend

3. **User Data:**
   - Only request necessary scopes (`profile`, `email`)
   - Handle user data according to privacy regulations
   - Provide clear privacy policy

## 🐛 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" Error:**
   - Check that the redirect URI in Google Console exactly matches the callback URL
   - Ensure you're using the correct protocol (http/https)

2. **"invalid_client" Error:**
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
   - Check that the OAuth credentials are enabled

3. **OAuth Flow Not Starting:**
   - Verify backend server is running on correct port
   - Check network connectivity to Google APIs
   - Ensure CORS is properly configured

4. **User Not Created:**
   - Check database connectivity
   - Verify User and Etudiant models are properly set up
   - Check server logs for database errors

## 📝 Next Steps

After setting up OAuth:
1. Test with multiple user accounts
2. Implement additional OAuth providers if needed
3. Add email verification for OAuth users
4. Set up production environment variables
5. Configure proper error logging and monitoring
