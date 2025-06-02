# PicklePulse AI

A modern pickleball analytics and matchmaking platform built with React, TypeScript, and Supabase.

## Features

### Authentication
- Email/Password authentication with Supabase
- Password reset functionality
- Google OAuth integration (coming soon)
- Mobile-friendly authentication UI
- Form validation and error handling
- Rate limiting for security
- Session management

### Core Features
- Health stats tracking (sleep, heart rate, calories)
- Performance analytics
- AI-driven insights
- Team and player tracking
- PWA support for offline access

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Environment Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/picklepulse-ai.git
cd picklepulse-ai
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Authentication Flow

The application uses Supabase for authentication with the following features:

1. **Sign Up**
   - Email/password registration
   - Email verification
   - Form validation
   - Error handling

2. **Sign In**
   - Email/password login
   - "Remember me" functionality
   - Error messages for invalid credentials

3. **Password Reset**
   - "Forgot Password" functionality
   - Email-based reset flow
   - Mobile-friendly reset UI
   - Success/error notifications

4. **Session Management**
   - Automatic session handling
   - Protected routes
   - Logout functionality

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Chakra UI
- **Backend/Auth**: Supabase
- **Build Tool**: Vite
- **State Management**: React Context
- **Form Handling**: Native React forms
- **Routing**: React Router

## Development

### Project Structure
```
src/
  ├── components/        # Reusable components
  │   └── auth/         # Authentication components
  ├── pages/            # Page components
  ├── services/         # API and service integrations
  ├── types/            # TypeScript type definitions
  ├── utils/            # Utility functions
  └── App.tsx          # Main application component
```

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

[Add your contact information]
