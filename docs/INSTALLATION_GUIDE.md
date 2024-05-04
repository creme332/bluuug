# Installation Guide

## Prerequisites

- Git
- Node.js
- NPM
- Mongo database

## Install project

Clone repository locally:
```bash
git clone git@github.com:creme332/bluuug.git
```

## Setup API

Navigate to API folder:

```bash
cd bluuug/cms-api
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```
PORT=4000
MONGO_STRING=
SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN=
```

## Setup database

In the `.env` file, fill `MONGO_STRING` with the connection string of your Mongo database.

Initialize your production MongoDB database:

```bash
npm run populate
```

## Setup CMS 

Navigate to the `cms-gui` folder:

```bash
cd bluuug/cms-gui
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with the following contents:

```bash
ADMIN_EMAIL=admin@bluuug.com
ADMIN_PASSWORD=adminpassword
```

