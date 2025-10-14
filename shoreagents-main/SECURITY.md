# Security Guidelines for ShoreAgents API

## API Key Security

### ✅ DO:
- Store API keys in environment variables only
- Use `.env.local` for local development (never commit this file)
- Use `.env.example` to show required environment variables
- Check for API key existence without logging the actual key
- Use generic error messages that don't expose sensitive information

### ❌ DON'T:
- Hardcode API keys in source code
- Log API keys or sensitive information
- Expose API keys in error messages
- Commit `.env.local` or any file containing real API keys

## Current Security Measures

### 1. Environment Variable Handling
```typescript
// ✅ Secure - checks existence without logging the key
const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

// ❌ Insecure - would log the actual key
console.log('API Key:', process.env.ANTHROPIC_API_KEY);
```

### 2. Error Handling
```typescript
// ✅ Secure - generic error message
return NextResponse.json(
  { error: 'Service temporarily unavailable. Please try again later.' },
  { status: 503 }
);

// ❌ Insecure - exposes configuration details
return NextResponse.json(
  { error: 'API key not configured. Please check your environment variables.' },
  { status: 500 }
);
```

### 3. Rate Limiting
- Implemented in-memory rate limiting (10 requests per minute per IP)
- In production, use Redis or similar for distributed rate limiting

### 4. Input Validation
- Validates request method (POST only)
- Validates JSON structure
- Validates message length (max 4000 characters)
- Validates conversation history format

### 5. Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Deployment Checklist

- [ ] Ensure `.env.local` is in `.gitignore`
- [ ] Set environment variables in production environment
- [ ] Use HTTPS in production
- [ ] Implement proper CORS policies
- [ ] Set up monitoring and alerting
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Environment Variables Required

```bash
# Required for AI chat functionality
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Required for currency conversion
NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY=your_api_key_here
```

## Best Practices

1. **Never commit secrets**: Always use `.gitignore` for environment files
2. **Use different keys**: Use different API keys for development and production
3. **Rotate keys regularly**: Change API keys periodically
4. **Monitor usage**: Keep track of API usage and costs
5. **Error handling**: Never expose internal details in error messages
6. **Rate limiting**: Implement proper rate limiting to prevent abuse
7. **Input validation**: Always validate and sanitize user input
8. **Security headers**: Use appropriate security headers
9. **Logging**: Log only necessary information, never secrets
10. **Updates**: Keep all dependencies and frameworks updated
