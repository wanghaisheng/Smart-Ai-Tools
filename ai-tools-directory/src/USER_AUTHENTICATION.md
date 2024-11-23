# User Authentication Module Documentation

## Table of Contents
1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Features](#features)
4. [Components](#components)
5. [Pages](#pages)
6. [Services](#services)
7. [API Routes](#api-routes)
8. [State Management](#state-management)
9. [Security](#security)
10. [Database Schema](#database-schema)
11. [Configuration](#configuration)
12. [OAuth Integration](#oauth-integration)

## Overview
The User Authentication module provides a secure and flexible authentication system with support for multiple authentication methods, OAuth providers, and role-based access control.

## Directory Structure
```
src/auth/
├── components/          # Authentication UI components
│   ├── forms/          # Authentication forms
│   ├── oauth/          # OAuth provider components
│   └── common/         # Common UI components
├── pages/              # Authentication pages
├── services/           # Authentication services
├── hooks/              # Custom auth hooks
├── store/              # Auth state management
├── guards/             # Route protection
├── utils/              # Auth utilities
└── types/              # TypeScript interfaces
```

## Features

### 1. Authentication Methods
- Email/Password
- Phone Number (SMS)
- Magic Link
- Social OAuth
- Two-Factor Authentication (2FA)
- Biometric Authentication

### 2. Security Features
- JWT Token Management
- Refresh Token Rotation
- Session Management
- Rate Limiting
- IP Blocking
- Device Tracking
- Audit Logging

### 3. Account Management
- Password Reset
- Email Verification
- Profile Management
- Account Recovery
- Multi-device Management
- Security Settings

### 4. OAuth Providers
- Google
- GitHub
- Microsoft
- Facebook
- Twitter
- Apple
- LinkedIn

## Components

### Authentication Forms

#### 1. LoginForm (`components/forms/LoginForm.jsx`)
Handles user login.

**Features:**
- Multiple login methods
- Remember me option
- Error handling
- Loading states
- OAuth buttons

**Key Functions:**
```javascript
handleLogin(credentials)
handleOAuthLogin(provider)
validateForm()
handleRememberMe()
```

#### 2. RegisterForm (`components/forms/RegisterForm.jsx`)
User registration form.

**Features:**
- Step-by-step registration
- Field validation
- Terms acceptance
- Email verification
- Password strength meter

#### 3. TwoFactorAuth (`components/forms/TwoFactorAuth.jsx`)
2FA verification component.

**Features:**
- Multiple 2FA methods
- Backup codes
- Remember device
- QR code display

### OAuth Components

#### 1. OAuthButtons (`components/oauth/OAuthButtons.jsx`)
Social login buttons.

**Features:**
- Provider logos
- Loading states
- Error handling
- Provider status

#### 2. OAuthCallback (`components/oauth/OAuthCallback.jsx`)
OAuth redirect handler.

**Features:**
- Token exchange
- Error handling
- Redirect management
- State verification

## Pages

### 1. LoginPage (`pages/LoginPage.jsx`)
Main login page.

**Features:**
- Multiple auth methods
- Password recovery
- Remember me
- OAuth options

**Key Functions:**
```javascript
handleLoginSubmit()
handleOAuthRedirect()
handlePasswordReset()
validateCredentials()
```

### 2. RegisterPage (`pages/RegisterPage.jsx`)
User registration page.

**Features:**
- Multi-step registration
- Email verification
- Terms acceptance
- Password requirements

### 3. AccountPage (`pages/AccountPage.jsx`)
Account management page.

**Features:**
- Profile settings
- Security settings
- Connected accounts
- Session management

## Services

### 1. AuthService (`services/authService.js`)
Core authentication service.

**Key Functions:**
```javascript
// Authentication
login(credentials)
register(userData)
logout()
refreshToken()
validateSession()

// Account Management
resetPassword(email)
updateProfile(data)
verifyEmail(token)
enable2FA(method)

// OAuth
handleOAuthLogin(provider)
linkOAuthAccount(provider)
unlinkOAuthAccount(provider)
```

### 2. TokenService (`services/tokenService.js`)
JWT token management.

**Key Functions:**
```javascript
getTokens()
setTokens(tokens)
refreshTokens()
clearTokens()
validateToken(token)
```

## API Routes

### Authentication Routes
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/resend-verification

// OAuth routes
GET    /api/auth/oauth/:provider
GET    /api/auth/oauth/:provider/callback
POST   /api/auth/oauth/link
POST   /api/auth/oauth/unlink

// 2FA routes
POST   /api/auth/2fa/enable
POST   /api/auth/2fa/verify
POST   /api/auth/2fa/disable
GET    /api/auth/2fa/backup-codes
```

### Account Routes
```
GET    /api/account/profile
PUT    /api/account/profile
PUT    /api/account/password
GET    /api/account/sessions
DELETE /api/account/sessions/:id
GET    /api/account/security-log
```

## State Management

### Auth Context
```javascript
{
  user: {
    id: string,
    email: string,
    roles: string[],
    verified: boolean,
    twoFactorEnabled: boolean
  },
  tokens: {
    accessToken: string,
    refreshToken: string
  },
  status: {
    authenticated: boolean,
    loading: boolean,
    error: string | null
  },
  methods: {
    login: Function,
    logout: Function,
    register: Function,
    refreshToken: Function
  }
}
```

## Security

### JWT Configuration
```javascript
{
  accessToken: {
    expiry: '15m',
    algorithm: 'RS256'
  },
  refreshToken: {
    expiry: '7d',
    algorithm: 'RS256'
  },
  tokenRotation: true,
  blacklisting: true
}
```

### Password Policy
```javascript
{
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 5,
  expiryDays: 90
}
```

## Database Schema

### User Schema
```javascript
{
  id: ObjectId,
  email: String,
  password: String,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    phone: String
  },
  security: {
    passwordHash: String,
    salt: String,
    twoFactorEnabled: Boolean,
    twoFactorMethod: String,
    backupCodes: Array
  },
  status: {
    verified: Boolean,
    active: Boolean,
    locked: Boolean
  },
  oauth: {
    google: Object,
    github: Object,
    microsoft: Object
  },
  sessions: [{
    token: String,
    device: String,
    ip: String,
    lastAccess: Date
  }],
  audit: [{
    action: String,
    ip: String,
    timestamp: Date,
    details: Object
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Configuration

### Environment Variables
```env
# JWT Configuration
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_EXPIRY=

# OAuth Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=

# Security
PASSWORD_SALT_ROUNDS=
RATE_LIMIT_WINDOW=
RATE_LIMIT_MAX_REQUESTS=
SESSION_SECRET=

# Email Service
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# SMS Service
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

### Feature Flags
```javascript
{
  ENABLE_OAUTH: boolean,
  ENABLE_2FA: boolean,
  ENABLE_BIOMETRIC: boolean,
  ENABLE_MAGIC_LINK: boolean,
  ENFORCE_PASSWORD_POLICY: boolean,
  ENABLE_SESSION_MANAGEMENT: boolean
}
```

## OAuth Integration

### Supported Providers
Each OAuth provider integration includes:
- Configuration
- API endpoints
- Token management
- Profile mapping
- Scope handling

#### Google OAuth
```javascript
{
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  scopes: ['profile', 'email'],
  callbackURL: '/auth/google/callback'
}
```

#### GitHub OAuth
```javascript
{
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  scopes: ['user:email'],
  callbackURL: '/auth/github/callback'
}
```

### Implementation Flow
1. OAuth Request
2. Provider Authentication
3. Callback Processing
4. Token Exchange
5. Profile Retrieval
6. Account Linking
7. Session Creation

## Error Handling

### Authentication Errors
```javascript
{
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Account has been locked',
  EMAIL_NOT_VERIFIED: 'Please verify your email',
  INVALID_TOKEN: 'Invalid or expired token',
  OAUTH_ERROR: 'OAuth authentication failed'
}
```

### Security Measures
- Rate limiting on auth endpoints
- IP-based blocking
- Suspicious activity detection
- Audit logging
- Session invalidation

---

## Contributing
Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
