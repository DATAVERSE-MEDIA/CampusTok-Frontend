# Campustok - Campus Social Network Frontend

A modern React.js application for campus social networking, built with Vite, Tailwind CSS, and Zustand.

## Features

-### Authentication Flow
- **Signup** - User registration with email and password
- **Email Verification** - 6-digit code verification (handled by backend)
- **Profile Selection** - Choose between Student or Institution account
- **Login** - Secure authentication
- **Create Account** - Complete profile setup
- **User Type Selection** - Final selection of account type

### Main Application
- **Landing Page** - Dashboard with quick actions and feed
- **Chatbot** - Interactive campus assistant
- **Campus Blog** - Read and share campus stories
- **Video** - Watch and share campus videos
- **Friends** - Connect with campus community
- **Search** - Search people, posts, videos, communities, and hashtags

### Navigation Sidebar
- **Profile** - View and edit user profile
- **Messages** - Real-time messaging interface
- **Community** - Join and participate in campus communities
- **Complaints** - Submit and track campus issues
- **Notifications** - View and manage notifications
- **Student Portal** - Embedded iframe for external student portal
- **Settings** - Account settings and preferences
- **Logout** - Sign out functionality

### Additional Features
- School selection dropdown in top navigation
- Responsive design with Tailwind CSS
- State management with Zustand
- Protected routes with authentication
- Modern UI with Lucide React icons

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx   # Main layout wrapper
│   │   ├── Sidebar.jsx  # Left navigation sidebar
│   │   └── TopNav.jsx   # Top navigation bar
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   └── ...         # Other pages
│   ├── store/           # Zustand stores
│   │   ├── useAuthStore.js
│   │   └── useAppStore.js
│   ├── App.jsx          # Main app component with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Demo Credentials

For testing the email verification follow the backend email flow; do not use hardcoded tokens.

## API Integration

The frontend is designed to work with an Express TypeScript backend. Update the API endpoints in the components when your backend is ready.

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme. The primary color is currently set to blue.

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.jsx`
3. Add navigation link in `src/components/Sidebar.jsx` if needed

## Development Notes

- All images use placeholder URLs from Unsplash. Replace with actual images from your Figma design.
- The Student Portal iframe uses a dummy URL. Update with your actual portal URL.
- State persistence is not implemented. Add localStorage or sessionStorage if needed.
- Form submissions currently show alerts. Replace with actual API calls.

## License

MIT

# CapusTok-Frontend-
