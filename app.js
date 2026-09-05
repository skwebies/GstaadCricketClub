/**
 * @file app.js
 * @description Production startup entrypoint for Plesk Node.js and Phusion Passenger.
 * Configured specifically for Node.js 22+ and Next.js 16 App Router on IONOS VPS.
 */

// Ensure production environment unless explicitly declared
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Load environment variables from .env files (.env.production, .env.local, .env)
try {
  const { loadEnvConfig } = require('@next/env');
  loadEnvConfig(process.cwd());
} catch {
  // Silent fallback if environment variables are injected via Plesk interface
}

const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV === 'development';
// Phusion Passenger injects process.env.PORT (port number or Unix domain socket path)
const port = process.env.PORT || 3000;

const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res).catch((err) => {
        console.error('Error handling request:', req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });
    });

    server.once('error', (err) => {
      console.error('Fatal server error:', err);
      process.exit(1);
    });

    // Listen on port/socket without forcing a host string so Passenger Unix sockets work natively
    server.listen(port, () => {
      console.log(
        `> Gstaad Cricket Club production server listening on port/socket: ${port} (mode: ${process.env.NODE_ENV})`
      );
    });

    // Graceful shutdown handling for Phusion Passenger restarts
    const handleShutdown = (signal) => {
      console.log(`> Received ${signal}. Gracefully closing HTTP server...`);
      server.close(() => {
        console.log('> Server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js application:', err);
    process.exit(1);
  });
