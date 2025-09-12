# User Journey Tracker Client

A simple React TypeScript client with styled-components that displays records from the backend API.

## Features

- 📊 Simple table display of user records
- 🎨 Beautiful styling with styled-components
- 🔄 Loading and error states
- 📱 Responsive design
- 🔗 API integration with backend

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. The app will be available at `http://localhost:3000`

## API Integration

The client connects to the backend server running on `http://localhost:5050` and fetches records from the `/record` endpoint.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── RecordsTable.tsx    # Table component
│   ├── services/
│   │   └── api.ts              # API service
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── vite.config.ts              # Vite configuration
```
