# Specification

## Summary
**Goal:** Update the User Portal branding and UI consistency, and fix missing Signup KYC and Gold/Silver rates visibility for authenticated users.

**Planned changes:**
- Add the uploaded ArthaNidhi Pay logo screenshot as a static asset under `frontend/public/assets/generated/` and update all User Portal logo usages (Header, Footer, and any auth pages that show a logo) to use the new asset path with English alt text.
- Revert the User Portal background styling to the previously used background color/theme (remove the current multi-color gradient) and apply consistently across both unauthenticated and authenticated pages (including Login, Signup, Dashboard, Market Insights, Mutual Funds, Stocks).
- Ensure Signup renders a clearly labeled, required KYC section; validate required KYC fields before allowing signup; persist KYC data with the user profile so it can be fetched after signup.
- Fix Gold & Silver Rates visibility for authenticated users by reliably rendering the module on the Dashboard, and add a dedicated protected Gold & Silver Rates page/route if the UI expects a separate page, with navigation from authenticated menus.

**User-visible outcome:** Users see the updated ArthaNidhi Pay logo across the User Portal, experience the restored non-gradient background theme on all pages, can complete Signup with required KYC details that are saved to their profile, and can reliably view Gold & Silver Rates after login (on the Dashboard and/or via a protected page).
