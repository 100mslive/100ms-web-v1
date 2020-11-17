# 100mslive sample web app

This is an example web app to demo 100mslive's web SDK

## Prerequisites

You will need [Node.js](https://nodejs.org) version v12.13.0 or greater installed on your system

## Setup

Get the code by cloning this repo using git

```
git clone git@github.com:100mslive/sample-app-web.git
```

Once cloned, open the terminal in the project directory, and install dependencies with:

```
npm install
```

### Token generation

Create a new file `.env` and copy the values from `example.env`

```
cp example.env .env
```

Update the `TOKEN_ENDPOINT` in `.env` file to your runkit endpoint (eg `https://ms-token-generation-service-4w7npt7zb4ol.runkit.sh/`)

### Firebase config

Update the following values from your firebase project settings:

```
# Firebase config
FIREBASE_API_KEY=<firebaseConfig.apiKey>
FIREBASE_AUTH_DOMAIN=<firebaseConfig.authDomain>
FIREBASE_DATABASE_URL=<firebaseConfig.databaseURL>
FIREBASE_PROJECT_ID=<firebaseConfig.projectId>
FIREBASE_STORAGE_BUCKET=<firebaseConfig.storageBucket>
FIREBASE_MESSAGING_ID=<firebaseConfig.messagingSenderId>
FIREBASE_APP_ID=<firebaseConfig.appId>
FIREBASE_MEASUREMENT_ID=<firebaseConfig.measurementId>
```

Then start the app with:

```
npm start
```

The app should now be up and running at http://localhost:8080 🚀