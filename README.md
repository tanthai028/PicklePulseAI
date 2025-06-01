# PicklePulse AI

A health and performance tracking app for athletes, correlating physical stats with gameplay performance. Built with React, TypeScript, and Supabase.

## Features

- Health stats tracking (sleep, heart rate, calories)
- Performance analytics
- AI-driven insights
- Team and player tracking
- PWA support for offline access

## Tech Stack

- **Frontend**: React (TypeScript) + Vite
- **UI Library**: Chakra UI
- **Backend/Auth**: Supabase
- **State Management**: Zustand
- **Routing**: React Router
- **PWA Support**: vite-plugin-pwa

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and service integrations
  ├── store/         # State management
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  ├── types/         # TypeScript type definitions
  ├── theme/         # Chakra UI theme customization
  └── assets/        # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
