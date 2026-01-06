import type { APIRoute } from 'astro';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Example route
app.get('/hello', (c) => {
  return c.json({ message: 'Hello from Mock API!' });
});

// Astro API endpoint
export const ALL: APIRoute = async ({ request }) => {
  return app.fetch(request);
};
