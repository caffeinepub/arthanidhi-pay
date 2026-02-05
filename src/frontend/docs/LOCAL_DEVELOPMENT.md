# Local Development Guide

This guide provides step-by-step instructions for setting up and running ArthaNidhi Pay (User Portal) on your local machine using VS Code and npm.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **pnpm** package manager
- **DFX** (DFINITY Canister SDK) - Required only for IC mode
  ```bash
  sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
  ```
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## Installation

1. **Clone or download the project:**
   ```bash
   # If using Git
   git clone <YOUR_GITHUB_REPO_URL>
   cd arthanidhi
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## Running ArthaNidhi Pay

ArthaNidhi Pay supports two backend modes: **IC Mode** (using Motoko canister) and **REST Mode** (using external Node.js backend).

### Option 1: IC Mode (Recommended for Full Stack Development)

IC Mode runs the complete application with the Motoko backend canister on a local Internet Computer replica.

**Step 1: Start the local Internet Computer replica**

Open a terminal in VS Code (Terminal → New Terminal) and run:

