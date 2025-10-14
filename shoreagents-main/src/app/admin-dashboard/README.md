# Admin Dashboard

## Overview
The Admin Dashboard provides comprehensive performance monitoring and analytics for the ShoreAgents website. It's designed to help administrators track website performance, user engagement, and system health.

## Features

### 🔐 Authentication
- Secure login system with demo credentials
- Session management with cookies
- Protected routes with middleware

### 📊 Performance Monitoring
- **Real-time Metrics**: Page views, unique visitors, load times
- **System Health**: Server uptime, API response times, error rates
- **Device Analytics**: Traffic breakdown by device type
- **Page Performance**: Individual page metrics and performance scores

### 🎨 Design
- **Lime Theme**: Consistent with ShoreAgents brand colors
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with shadcn/ui components

## Access

### Demo Credentials
- **Email**: admin@shoreagents.com
- **Password**: admin123

### URLs
- **Login**: Use the login modal on the home page
- **Dashboard**: `/admin`

## Navigation
- Access the admin dashboard via the shield icon in the main navigation
- The admin link is subtly placed and only visible to authorized users

## Technical Details

### Components Used
- **shadcn/ui**: Modern UI components with proper naming to avoid conflicts
- **Next.js**: App router with middleware for route protection
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Styling with lime color theme

### File Structure
```
src/app/admin/
├── page.tsx              # Main dashboard
├── login/
│   └── page.tsx          # Login page
└── README.md             # This file

src/components/ui/
├── shadcn-button.tsx     # Admin-specific button component
├── shadcn-input.tsx      # Admin-specific input component
└── shadcn-label.tsx      # Admin-specific label component

src/middleware.ts         # Route protection
```

### Future Enhancements
- **CMS Integration**: Content management system for easy website updates
- **User Management**: Admin user roles and permissions
- **Advanced Analytics**: More detailed reporting and insights
- **Real-time Notifications**: Alerts for system issues
- **Export Features**: Data export capabilities

## Security Notes
- Demo credentials are for development/testing only
- In production, implement proper authentication with JWT tokens
- Add rate limiting and additional security measures
- Consider implementing 2FA for enhanced security

## Performance
- Auto-refresh every 30 seconds
- Simulated data for demonstration
- Optimized for fast loading and smooth interactions
- Responsive design for all screen sizes
