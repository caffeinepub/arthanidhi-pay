# REST Backend API Contract

This document specifies the complete REST API contract that an external Node.js/Express backend (in the `backend-node` folder) must implement to support the ArthaNidhi frontend in REST mode.

## ⚠️ Production Readiness Notes

**This contract describes the API interface for LOCAL DEVELOPMENT and DEMO purposes.**

### Security Requirements for Production

Before deploying to production, your `backend-node` implementation MUST include:

1. **Authentication & Authorization**
   - Replace the demo Bearer token (user.id from localStorage) with secure JWT tokens or OAuth 2.0
   - Implement proper session management with httpOnly cookies
   - Validate and verify tokens on every request
   - Add CSRF protection for state-changing operations
   - Never trust client-provided user IDs - always derive from verified session

2. **Input Validation & Sanitization**
   - Validate all request parameters and body data
   - Sanitize inputs to prevent SQL injection and XSS attacks
   - Use prepared statements for all database queries
   - Implement request size limits

3. **Error Handling**
   - Never expose stack traces or internal errors to clients
   - Log errors server-side with proper monitoring (Winston, Sentry)
   - Return generic error messages to clients
   - Implement proper HTTP status codes

4. **Security Headers & HTTPS**
   - Use helmet.js for security headers
   - Enforce HTTPS in production (redirect HTTP to HTTPS)
   - Configure CORS properly for your production domain
   - Implement rate limiting (express-rate-limit)

5. **Secrets Management**
   - Store all secrets in environment variables (never in code)
   - Use .env files for local development only
   - Use secure secret management in production (AWS Secrets Manager, HashiCorp Vault)
   - Never commit secrets to Git

6. **Database Security**
   - Use connection pooling
   - Implement proper access controls
   - Enable SSL/TLS for database connections
   - Regular backups and disaster recovery plans

**⚠️ The demo authentication mechanism (localStorage user.id as Bearer token) is NOT secure for production. It is intended only for local development and testing.**

## Table of Contents

1. [Configuration](#configuration)
2. [Authentication](#authentication)
3. [Request/Response Format](#requestresponse-format)
4. [BigInt Handling](#bigint-handling)
5. [Error Responses](#error-responses)
6. [API Endpoints](#api-endpoints)
7. [Implementation Examples](#implementation-examples)
8. [Payment Gateway Integration](#payment-gateway-integration)

---

## Configuration

### Environment Variables

Set the following in your frontend `.env` file (in `frontend/` directory):

