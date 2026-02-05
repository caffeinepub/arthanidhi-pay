# Specification

## Summary
**Goal:** Add a separate Admin Portal frontend alongside the existing ArthaNidhi Pay user portal, with its own environment configuration and regular (non–Internet Identity) authentication for both portals, while sharing the same backend with admin-only authorization.

**Planned changes:**
- Create a clearly separated Admin Portal frontend entry in the repo with its own routes, auth pages, and distinct admin layout, reusing the ArthaNidhi Pay background style (light surface with soft wave accents).
- Add admin-specific environment configuration so the Admin Portal can be run/built independently (including dev/stage/prod separation if already used by the user portal) without changing the user portal env setup.
- Implement regular app-managed authentication for both portals: signup, login, logout, session persistence, and protected routes that redirect to the correct portal login.
- Add “Forgot password?” on both login pages and implement a password recovery/reset flow for both portals (English-only UI text).
- Update the backend to support admin-authorized operations for the Admin Portal while preserving existing user operations and enforcing admin-only access rules.
- Add in-repo developer documentation describing an ordered batch delivery plan and clearly mapping which folders/files belong to the user portal vs the admin portal, including how to run both side-by-side in VS Code.

**User-visible outcome:** Users can sign up/login/logout and reset passwords in the ArthaNidhi Pay portal, admins can separately sign up/login/logout and reset passwords in a dedicated Admin Portal, and admins can access admin-only data/actions through the same backend with proper authorization.
