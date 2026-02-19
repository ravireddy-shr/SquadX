# SkillChain Pro - Troubleshooting Guide

Solutions to common issues and problems.

## Frontend Issues

### Development Server Won't Start

**Error**: `Port 3000 already in use`

```bash
# Kill process using port 3000
# macOS/Linux
lsof -i tcp:3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows (PowerShell)
Get-Process | Where-Object {$_.Ports -eq 3000} | Stop-Process -Force

# Or use a different port
npm run dev -- -p 3001
```

**Error**: `Cannot find module`

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Verify specific package
npm ls @perawallet/connect
```

### Wallet Connection Issues

**Error**: "Failed to connect wallet" or wallet doesn't appear

**Solutions**:
1. Install Pera Wallet: https://perawallet.app
2. Clear browser cache and cookies
3. Ensure HTTPS on production (Pera requires it)
4. Check browser console for CORS errors
5. Verify wallet is on Testnet network

**Code to test**:
```typescript
// In browser console:
console.log(window.AlgoSigner); // Should show wallet object
```

### Charts Not Rendering (Recharts)

**Error**: `Cannot read property 'map' of undefined`

**Solutions**:
1. Verify data structure:
```typescript
// Correct format
[{ month: 'Jan', certificates: 120 }, ...]

// Issue if numeric keys are strings
[{ month: 'Jan', certificates: '120' }, ...] // ❌
```

2. Reinstall Recharts:
```bash
npm uninstall recharts
npm install recharts
```

3. Check ResponsiveContainer parent width:
```tsx
// ❌ Wrong - Parent has no width
<div>
  <ResponsiveContainer width="100%">
    <LineChart data={data}>
```

```tsx
// ✅ Correct
<div className="w-full">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
```

### TypeScript Errors

**Error**: `Type 'X' is not assignable to type 'Y'`

```bash
# Check all TS errors
npx tsc --noEmit

# Fix automatically
npx tsc --noEmit --strict
```

**Common fixes**:
- Add type annotations: `const x: number = 5;`
- Use optional chaining: `obj?.prop?.value`
- Handle null: `value ?? fallback`

### Styling Issues (Tailwind)

**Problem**: Styles not applying

**Solutions**:
1. Verify class names are correct (typo check)
2. Ensure dark mode config in `tailwind.config.ts`
3. Clear Tailwind cache:
```bash
rm -rf .next
npm run build
```

4. Check if using @apply correctly:
```css
/* ✅ Correct */
@apply px-4 py-2 rounded;

/* ❌ Wrong */
@apply px-4; @apply py-2;
```

### Animations Not Smooth

**Problem**: Jerky animations, low FPS

**Solutions**:
1. Check browser: Open DevTools → Performance tab
2. Use `will-change` CSS (sparingly):
```tsx
<motion.div 
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

3. Reduce animation duration:
```tsx
// ❌ Long duration
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 2 }}

// ✅ Better
transition={{ duration: 0.3 }}
```

4. Lazy load images:
```tsx
import Image from 'next/image';
<Image src={url} alt="" loading="lazy" />
```

## Smart Contract Issues

### Contract Deployment Fails

**Error**: `Validation failed` or `Compile error`

**Solutions**:
1. Check PyTEAL syntax:
```bash
cd contracts
python -m py_compile skillchain.py
```

2. Verify dependencies:
```bash
pip install -r requirements.txt
```

3. Check Algorand connection:
```bash
algokit explore testnet
```

### Contract Method Won't Execute

**Error**: `Program not found` (App ID 0)

**Solutions**:
1. Verify NEXT_PUBLIC_APP_ID in `.env.local`:
```bash
echo $NEXT_PUBLIC_APP_ID  # Should print number, not empty
```

2. Check contract exists on-chain:
- Visit https://testnet.algoexplorer.io
- Search for your App ID
- Verify on correct network (testnet)

3. Verify contract initialization:
```bash
algokit explore testnet
# Select your account and app
# Check local state and global state
```

### Transaction Limits

**Error**: `Insufficient message budget`

**Solutions**:
1. Reduce transaction size
2. Split large operations
3. Check PyTEAL operation count:
```python
# Compile and check size
from pyteal import compileExpr
expr = app.bulk_issue_certificates(...)
print(compileExpr(expr))  # Check byte length
```

## Deployment Issues

### Vercel Build Fails

**Error**: `Build failed: Next.js build error`

**Solutions**:
1. Check logs:
```bash
vercel logs --tail
```

2. Build locally first:
```bash
npm run build
# Check for errors before pushing
```

3. Verify environment variables in Vercel dashboard:
- Project Settings → Environment Variables
- Restart deployment after adding vars

**Error**: `env variables not accessible`

```bash
# Variables must be prefixed with NEXT_PUBLIC_ to be available in browser
❌ ALGOD_TOKEN=...
✅ NEXT_PUBLIC_ALGOD_TOKEN=...
```

### Page Load Too Slow

**Solutions**:
1. Run Lighthouse audit:
```bash
lighthouse https://your-deployment.vercel.app
```

2. Optimize images:
```bash
# Check image sizes
du -h public/images/**
```

3. Reduce bundle size:
```bash
npm run build
# Check .next/static folder
```

4. Use static generation:
```typescript
export const getStaticProps = async () => {
  return { props: {}, revalidate: 60 } // Cache for 60s
}
```

## Database Issues (If Using)

### Cannot Connect to Algorand

**Error**: `Connection refused` or `ECONNREFUSED`

**Solutions**:
1. Verify endpoint is correct:
```bash
curl https://testnet-api.algonode.cloud/health
# Should return 200 OK
```

2. Check network connectivity:
```bash
ping testnet-api.algonode.cloud
```

3. Verify auth token (if required):
```bash
curl -H "X-API-Key: your-token" https://testnet-api.algonode.cloud/
```

## Testing Issues

### Unit Tests Fail

**Error**: `Cannot find module` or `Import error`

```bash
# Ensure test config correct
cat jest.config.js

# Run with verbose output
npm test -- --verbose

# Test specific file
npm test -- utils/hash.test.ts
```

### pytest Errors (Contract Tests)

**Error**: `Module not found: 'beaker'`

```bash
cd contracts
pip install -r requirements.txt
pytest tests/ -v
```

**Error**: `Algod connection failed`

Ensure AlgoKit is running locally:
```bash
algokit localnet start
```

## Performance Debugging

### Profile React Components

```tsx
import { Profiler } from 'react';

<Profiler id="component-name" onRender={onRenderCallback}>
  <YourComponent />
</Profiler>
```

### Check Network Performance

1. Open DevTools → Network tab
2. Check:
   - Bundle size: Should be < 200KB (gzipped)
   - Load time: DOMContentLoaded < 2s
   - Images: Optimized and lazy-loaded

### Memory Leaks

```tsx
// ❌ Memory leak
useEffect(() => {
  setInterval(() => { ... }, 1000)
  // No cleanup!
})

// ✅ Fixed
useEffect(() => {
  const interval = setInterval(() => { ... }, 1000)
  return () => clearInterval(interval) // Cleanup
}, [])
```

## Security Issues

### XSS Vulnerability

**Problem**: Injecting scripts in input fields

**Solution**: React prevents XSS by default:
```tsx
// ✅ Safe - React escapes by default
<div>{userInput}</div>

// ❌ Unsafe
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

### CORS Issues

**Error**: `Access to XMLHttpRequest blocked`

**Solutions**:
1. Use same-origin requests where possible
2. Configure CORS in API:
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT'
}
```

## Getting More Help

1. **Check the code**: Look at working examples in the codebase
2. **Read docs**: Algorand, Next.js, Recharts documentation
3. **Search issues**: GitHub Issues for similar problems
4. **Stack Overflow**: Tag: `algorand`, `nextjs`, or `react`
5. **Discord**: Algorand Discord community

## Still Stuck?

Create a minimal reproduction:
```bash
# Clone clean repo
git clone <repo> test-issue
cd test-issue
npm install

# Try to reproduce the issue
# Document exact steps and error messages
```

Then share:
- Error message (full stack trace)
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, etc.)

---

**Most issues are solved by**: `rm -rf node_modules && npm install` 🔄
