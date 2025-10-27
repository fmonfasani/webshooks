# SaaS Builder Router Tests

## Manual Verification
- Start the app with BrowserRouter and AppRouter.
- Confirm unauthenticated access to /dashboard redirects to /.
- Sign in with a password >= 4 chars and observe redirect to /dashboard.
- Toggle theme and ensure preference persists after refresh.
- Sign out from dashboard returns to auth screen.

