# LeFri Platform

A comprehensive legal platform that combines legal consultations, process management, and emergency alerts.

## 🚀 Technologies

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: Google OAuth 2.0
- **Integrated APIs**: 
  - Google Gemini AI
  - WhatsApp Business API
  - Email Services
  - Voice Services

## 📦 Project Structure

```
LeFriPlatform/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Main pages
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
├── server/                # Express Backend
│   ├── config/           # Configurations
│   ├── services/         # External services
│   ├── storage/          # Persistence layer
│   └── types/            # TypeScript types
└── shared/               # Shared code
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/dark-yx/LeFriPlatform.git
cd LeFriPlatform
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

In the root directory, create `.env`:
```env
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=your_secure_secret
```

In the `client` directory, create `.env`:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000
```

4. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable Google OAuth 2.0 API
   - Create OAuth 2.0 credentials
   - Add the following authorized URIs:
     - `http://localhost:5000`
     - `http://localhost:5173`
   - Add the following JavaScript origins:
     - `http://localhost:5000`
     - `http://localhost:5173`

5. Start the development server:
```bash
npm run dev
```

## 🔑 Authentication

The application uses Google OAuth 2.0 for authentication. To ensure proper functionality:

1. Make sure environment variables are correctly configured
2. Verify redirect URIs are set up in Google Cloud Console
3. The client ID must be the same in both `.env` files

## 🚨 Troubleshooting

### Google Authentication Error

If you encounter the "Invalid server response" error:

1. Check the browser console logs (F12)
2. Ensure the server is running on port 5000
3. Verify environment variables are correctly configured
4. Clear browser cache and localStorage data
5. Restart the server

### Common Issues

1. **CORS Error**: 
   - Verify origins are correctly configured
   - Ensure the server is configured to accept credentials

2. **MongoDB Connection Error**:
   - Verify MongoDB URI
   - Ensure database is accessible

3. **Authentication Error**:
   - Verify Google OAuth credentials
   - Ensure redirect URIs are correctly configured

## 📝 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run check`: TypeScript type checking

## 🔒 Security

- Google OAuth 2.0 Authentication
- Secure sessions with express-session
- CSRF protection
- Data validation with Zod
- Input sanitization

## 📄 License

All rights reserved.

This software and its documentation are the intellectual property of LeFriPlatform. The following are strictly prohibited:

- Reproduction of all or part of the code
- Distribution or commercialization of the software
- Modification or creation of derivative works
- Unauthorized use of any part of the intellectual property

Any unauthorized use of this software constitutes copyright infringement and may result in legal action.

## 🙏 Acknowledgments

- Underlife Foundation
- Weblifetech

---

Developed with ❤️ in Ecuador