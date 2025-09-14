#!/bin/bash

# User Journey Tracker - Development Startup Script
# This script starts the server, client, and API documentation simultaneously

set -e  # Exit on any error

echo "🚀 Starting User Journey Tracker Development Environment..."
echo ""

# Function to cleanup background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development environment..."
    jobs -p | xargs -r kill
    exit 0
}

# Set up signal handlers for cleanup
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -f "server/package.json" ] || [ ! -f "client/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build and start the server (API backend)
echo "📡 Building and starting server..."
cd server
npm run build
node --env-file=config.env dist/server.js &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Start the client (React frontend)
echo ""
echo "💻 Starting client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

# Wait a moment for client to start
sleep 3

echo ""
echo "✅ Development environment started successfully!"
echo ""
echo "🌐 Services running:"
echo "   • Server (API): http://localhost:5050"
echo "   • Client (React): http://localhost:3000"
echo "   • API Documentation: http://localhost:5050/api-docs"
echo ""

# Open browser tab for frontend
echo "🌐 Opening frontend..."
if command -v open >/dev/null 2>&1; then
    # macOS
    open http://localhost:3000
elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open http://localhost:3000
elif command -v start >/dev/null 2>&1; then
    # Windows
    start http://localhost:3000
else
    echo "   Please manually open: http://localhost:3000"
fi

echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes
wait