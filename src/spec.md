# Specification

## Summary
**Goal:** Provide the complete existing project source code (frontend + backend) directly in chat as a copy/paste-friendly alternative to the platform “Export Code” feature.

**Planned changes:**
- Output the full repository content in chat, organized file-by-file with exact relative paths and full file contents for both frontend and backend.
- Include step-by-step instructions to recreate the folder/file structure locally in VS Code, paste files safely, install dependencies, configure environment variables from the existing `.env.example` files, and run frontend/backend locally.
- Ensure all user-facing text in the delivered code and instructions is in English.

**User-visible outcome:** The user can copy/paste the provided files to reconstruct the full project locally in VS Code, configure env vars, install dependencies, and run the frontend and backend without using the “Export Code” button.
