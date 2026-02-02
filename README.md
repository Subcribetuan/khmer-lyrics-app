# Khmer Lyrics Collection

A beautiful web app to save and manage your Khmer song lyrics with translations.

## Features

- Save lyrics in 3 formats: Khmer script, Romanized, and English translation
- Beautiful Cambodian-inspired design with gold/warm tones
- Light and Dark mode
- PWA - Install on your phone like a native app
- Simple login system
- Firebase cloud storage
- Edit and delete songs
- Search your collection
- YouTube link support

## Quick Start

### 1. Install Dependencies

```bash
cd khmer-lyrics-app
npm install
```

### 2. Set Up Firebase

1. Go to Firebase Console (https://console.firebase.google.com/)
2. Create a new project (name it "khmer-lyrics" or similar)
3. Click Firestore Database - Create database - Start in test mode
4. Go to Project Settings (gear icon) - Your apps - Click web icon
5. Register your app and copy the config

### 3. Add Your Firebase Config

Open src/firebase.js and replace the placeholder config with your own.

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 5. Login Credentials

Default login (you can change these in src/App.jsx):

- Username: admin
- Password: khmer2024

## Customize Login

To change the login credentials, edit src/App.jsx and find the login function.

## Project Structure

```
khmer-lyrics-app/
  public/
    favicon.svg
  src/
    pages/
      LoginPage.jsx
      HomePage.jsx
      SongPage.jsx
      AddSongPage.jsx
      EditSongPage.jsx
    App.jsx
    main.jsx
    index.css
    firebase.js
  index.html
  package.json
  vite.config.js
```

## Available Scripts

```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel or Netlify

Push to GitHub, then connect your repo and deploy.

## Enjoy your Khmer Lyrics Collection!
