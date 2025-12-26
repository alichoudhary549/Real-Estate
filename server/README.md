# Server (API)

This server uses **Mongoose** with MongoDB.

## Required environment variables

 - `DATABASE_URL` - MongoDB connection string used by the app (ex: `mongodb+srv://user:pass@cluster.../dbname`) or local (ex: `mongodb://localhost:27017/realestate`).
- `JWT_SECRET` - your JWT secret
- `PORT` - server port (optional, default: 8000)

> Tip: The repository's `.env` already contains a `MONGO` value. Make sure `DATABASE_URL` is present and points to your MongoDB cluster. If you are running locally, set `DATABASE_URL` to `mongodb://localhost:27017/realestate` (this repo is now configured for that if you prefer local Mongo).

## Run

1. cd into `server`
2. npm install
3. npm run start

This will run `nodemon index.js`; Mongoose will attempt to connect at startup. If the connection fails the process will exit with an error (so you can spot configuration issues immediately).

## Seeding & quick verification

- To create sample data for testing: `npm run seed` (runs `seed.js` and creates one `User` and one `Residency` if they do not already exist).
- Use the API to verify data: `GET /api/residency/status` returns `{ usersCount, residenciesCount }` and `GET /api/residency/allresd` returns seeded residencies.

## Authentication

- This project now uses a simple JWT-based auth system (no Auth0). The server exposes these endpoints:
	- POST `/api/auth/signup` { name, email, password } → creates user and returns `{ token, user }`
	- POST `/api/auth/login` { email, password } → returns `{ token, user }`
	- POST `/api/auth/forgot-password` { email } → generates a reset token (returned in response for dev/test)
	- POST `/api/auth/reset-password` { token, password } → resets the password
	- POST `/api/auth/google` { idToken } → verifies Google id token and signs the user in (or creates user)

Set `GOOGLE_CLIENT_ID` in `.env` if you plan to use Google sign-in from the client.
Note: You should also set the client-side env var `VITE_GOOGLE_CLIENT_ID` in the `client/.env` file to the same Google OAuth client ID so the Google Identity button can be initialized in the browser.