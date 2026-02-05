# Specification

## Summary
**Goal:** Add a premium India-focused dark-mode banking background and apply it across the ArthaNidhi Pay User Portal in dark mode while preserving readability and not affecting light mode.

**Planned changes:**
- Add a new high-resolution dark-mode fintech background image under `frontend/public/assets/generated/` with the specified filename and visual constraints (no people/text/logos/watermarks).
- Apply the new background image across the portal in dark mode for both unauthenticated and authenticated pages (at minimum: Login, Signup, Dashboard, Account, Statements, Market Insights, Mutual Funds, Stocks, Gold & Silver Rates, Profile/Settings).
- Adjust dark-mode styling as needed to maintain high contrast and readability for primary UI surfaces (cards, tables, form fields, navigation) while keeping the background subtle.

**User-visible outcome:** When using dark mode, users see a premium, subtle fintech background across key portal screens with readable, high-contrast UI content; light mode remains unchanged.
