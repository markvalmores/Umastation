# UmaStation

A refined, high-tech gaming dashboard for Umamusume fans. Interactive database, music player, and live gacha updates.

## Deployment

### Vercel

This project is configured to work on Vercel as a full-stack Express app.

1.  Connect your GitHub repository to Vercel.
2.  Add your environment variables (e.g., `GEMINI_API_KEY`) in the Vercel project settings.
3.  The `vercel.json` file handles the routing and serverless function setup.

### GitHub Actions

You can use GitHub Actions to automate your build and deployment process.

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

## Production Build

1.  Build the frontend:
    ```bash
    npm run build
    ```
2.  Start the production server:
    ```bash
    npm start
    ```
