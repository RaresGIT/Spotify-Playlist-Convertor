@echo off

echo Starting Google Service
start node backend/services/google/server.js

echo Starting Spotify Service
start node backend/services/spotify/server.js

echo Starting Frontend
cd frontend
npm start

