# 100mslive sample web app

This is an example web app to demo 100mslive's web SDK

## Prerequisites

You will need [Node.js](https://nodejs.org) version v12.13.0 or greater installed on your system

## Setup

Get the code by cloning this repo using git. Branch self-serve-localhost

```
git clone git@github.com:100mslive/sample-app-web.git
git checkout self-serve-localhost
```

Once cloned, open the terminal in the project directory, and install dependencies with:

```
cd sample-app-web
npm install
```

Create a new file `.env` and copy the values from `example.env`

```
cp example.env .env
```

Get authorization credentials and update `.env`

```
MANAGEMENT_KEY=<management access_key>
MANAGEMENT_SECRET=<management secret>
CUSTOMER_ID=<customer>
APP_ID=<app>
APP_ACCESS_KEY=<application access_key>
APP_SECRET=<application secret>
```

## Setup

Start the web app with:

```
npm run dev
```

The app should now be up and running at http://localhost:3000 🚀

To stop the app press `Ctrl + C`
