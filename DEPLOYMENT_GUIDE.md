# SkillChain Pro - Deployment Guide

Complete step-by-step guide to deploy SkillChain Pro to production.

## Prerequisites

- Node.js 18+ and npm 9+
- Python 3.10+
- Git
- Algorand account with testnet balance
- Pera Wallet browser extension
- Vercel account (for frontend deployment)

## Part 1: Smart Contract Deployment

### 1.1 Install Dependencies

```bash
cd contracts
pip install -r requirements.txt
```

### 1.2 Initialize AlgoKit

```bash
algokit init
```

Follow the prompts to configure your Algorand environment.

### 1.3 Deploy to Testnet

```bash
algokit deploy testnet
```

The script will output:
- **App ID**: Note this - required for frontend
- **Creator Address**: Your institution's address
- **Transaction ID**: For verification on AlgoExplorer

### 1.4 Verify Deployment

Visit [Algorand TestNet Explorer](https://testnet.algoexplorer.io) and search:
- Your app ID
- Your creator address
- Transaction ID from deployment

### 1.5 Run Contract Tests

```bash
pytest tests/test_skillchain.py -v
```

All tests should pass. Check coverage:

```bash
pytest tests/test_skillchain.py --cov=skillchain --cov-report=term-missing
```

## Part 2: Frontend Setup

### 2.1 Install Dependencies

```bash
cd frontend
npm install
```

### 2.2 Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# From smart contract deployment
NEXT_PUBLIC_APP_ID=<your-app-id-from-step-1.3>

# Algorand Testnet Config
NEXT_PUBLIC_ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
NEXT_PUBLIC_ALGOD_SERVER=https://testnet-api.algonode.cloud

# Pera Wallet (optional)
NEXT_PUBLIC_PERA_WALLET_ID=<your-pera-id>
```

### 2.3 Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:
- Landing page loads with animated background
- Squares animation plays smoothly
- Wallet connection button appears
- Navigation to all dashboards works

### 2.4 Lint and Format

```bash
npm run lint:fix
```

Fix any TypeScript or ESLint errors before deployment.

### 2.5 Build for Production

```bash
npm run build
```

Check for build errors. All TypeScript should compile without errors.

## Part 3: Frontend Deployment to Vercel

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Deploy

From the `frontend` directory:

```bash
vercel --prod
```

Vercel will prompt for:
- Project name: `skillchain-pro`
- Framework: Select "Next.js"
- Source directory: Use default
- Build command: Use default
- Output directory: `.next`

### 3.3 Configure Environment in Vercel

After deployment, configure in Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_APP_ID`
   - `NEXT_PUBLIC_ALGOD_TOKEN`
   - `NEXT_PUBLIC_ALGOD_SERVER`

### 3.4 Redeploy with Environment Variables

```bash
vercel --prod
```

### 3.5 Verify Deployment

Visit your Vercel deployment URL and test:
- Page loads in < 3s
- Animations smooth (60fps)
- Wallet connection works
- All dashboards accessible

## Part 4: Post-Deployment Verification

### 4.1 Test Smart Contract Interaction

1. **Institution Dashboard** (`/institution`)
   - Upload sample CSV from `/sample/bulk_upload.csv`
   - Click "Issue All Certificates"
   - Verify transaction in Algorand Explorer

2. **Student Dashboard** (`/student`)
   - Enter a test Aadhar: `123456789012`
   - Click "Verify Credentials"
   - Should see Aadhar hash (never transmitted to server)

3. **Employer Dashboard** (`/employer`)
   - Apply filters (CGPA, degree, skills)
   - Results should filter dynamically
   - Click candidate to see modal

4. **Analytics Dashboard** (`/analytics`)
   - Charts should render without errors
   - Time range selector functional
   - All stats visible and formatted

### 4.2 Monitor Performance

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://your-deployment-url.vercel.app --view
```

Target metrics:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### 4.3 Test Error Handling

Intentionally trigger errors to verify ErrorBoundary:
1. Open browser dev tools → Console
2. Try invalid Aadhar input
3. Check for graceful error messages
4. Verify error logs in console

## Part 5: Production Configuration

### 5.1 Enable Pre-commit Hooks

```bash
# In root directory
pip install pre-commit
pre-commit install

# Test hooks
pre-commit run --all-files
```

### 5.2 Setup GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Lint
        run: npm run lint
```

### 5.3 Setup Security Headers

In `frontend/vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## Part 6: Monitoring & Maintenance

### 6.1 Collect Metrics

- **Frontend**: Vercel Analytics Dashboard
- **Smart Contract**: Monitor transactions on AlgoExplorer
- **Errors**: Setup error tracking (Sentry, LogRocket)

### 6.2 Regular Updates

Run monthly:

```bash
# Update dependencies
cd frontend && npm update
cd ../contracts && pip install -r requirements.txt --upgrade

# Run tests
npm test
pytest tests/ -v

# Deploy updates
vercel --prod
```

### 6.3 Backup Smart Contract State

Export contract state monthly:

```bash
algokit explore testnet
# Export account state to JSON
```

## Troubleshooting

### Smart Contract Issues

**Error: "Program not found"**
- Verify app ID in NEXT_PUBLIC_APP_ID env var
- Check contract deployment on AlgoExplorer

**Error: "Validation failed"**
- Check certificate data matches contract schema
- Verify Aadhar hash is exactly 64 characters

### Frontend Issues

**Error: "Failed to connect wallet"**
- Install Pera Wallet extension
- Ensure using HTTPS on production
- Check CORS headers

**Error: "Build failed"**
- Run `npm run lint:fix` to fix style issues
- Check TypeScript: `npx tsc --noEmit`
- Clear cache: `rm -rf .next node_modules && npm install`

**Charts not rendering**
- Verify Recharts installed: `npm list recharts`
- Check browser console for errors
- Ensure data structure matches Recharts format

## Support

- **Algorand Docs**: https://developer.algorand.org
- **Beaker Docs**: https://algorand-devrel.github.io/beaker/
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## Checklist for Production

- [ ] Smart contract deployed to testnet
- [ ] App ID saved and verified
- [ ] Frontend environment variables configured
- [ ] All pages tested locally
- [ ] Lint and tests pass
- [ ] Build completes without errors
- [ ] Deployed to Vercel
- [ ] Env vars configured in Vercel
- [ ] Production URL tested
- [ ] Error boundaries verified
- [ ] Performance audit > 90
- [ ] Security headers configured
- [ ] Pre-commit hooks installed
- [ ] Monitoring setup
- [ ] Backup procedures documented

## Post-Launch

1. **Day 1**: Monitor error logs and performance metrics
2. **Week 1**: Gather user feedback and fix critical issues
3. **Month 1**: Review analytics, optimize slow queries, plan features
4. **Ongoing**: Regular security updates and dependency maintenance

---

**Estimated Time**: 2-3 hours for complete deployment  
**Last Updated**: February 2026  
**Version**: 1.0.0
