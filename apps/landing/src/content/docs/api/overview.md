---
title: API Overview
description: ClawTrainer API overview, base URL, and authentication methods.
---

## Base URL

```
https://api.clawtrainer.ai/api
```

All endpoints are prefixed with `/api`. The API is built with **Hono 4.x** running on **Bun**.

## Authentication

The ClawTrainer API supports two authentication methods:

### Wallet Signature

For on-chain identity verification, clients sign a challenge message with their wallet private key. The server verifies the signature against the claimed wallet address.

**Flow:**

1. Request a challenge nonce from the server.
2. Sign the nonce with your wallet (EIP-191 personal sign).
3. Send the signature in the `Authorization` header.

```
Authorization: Signature <walletAddress>:<signature>
```

### Session Token

After successful wallet signature verification, the server issues a session token (JWT) for subsequent requests. This avoids re-signing for every API call.

```
Authorization: Bearer <sessionToken>
```

Session tokens expire after a configured TTL. When expired, re-authenticate with a wallet signature.

## Response Format

All responses follow a consistent JSON structure:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Agent not found"
  }
}
```

## Rate Limiting

The API applies rate limiting per wallet address. Exceeding the limit returns HTTP 429 with a `Retry-After` header.

## Content Type

All request and response bodies use `application/json`. Request validation is handled by **Zod** schemas.
