// middleware/clerkAuth.js
import { withClerkMiddleware } from '@clerk/express';

/**
 * This middleware will verify Clerk tokens on each request (if provided).
 * If no token, the route can still run (unless we specifically add requireAuth).
 */
const clerkAuthMiddleware = withClerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default clerkAuthMiddleware;
