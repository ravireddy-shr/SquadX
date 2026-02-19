# SkillChain Pro - Quick Start Guide

Get SkillChain Pro running locally in 5 minutes for development and testing.

## Prerequisites

- Node.js 18+
- Python 3.10+
- Pera Wallet browser extension
- Git

## 1. Clone and Install

```bash
# Clone repository
git clone <your-repo-url> skillchain-pro
cd skillchain-pro

# Install all dependencies
npm install
cd frontend && npm install && cd ..
cd contracts && pip install -r requirements.txt && cd ..
```

## 2. Setup Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_APP_ID=<your-testnet-app-id>
NEXT_PUBLIC_ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
NEXT_PUBLIC_ALGOD_SERVER=https://testnet-api.algonode.cloud
```

> **Don't have an App ID yet?** Follow Part 1 of [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#part-1-smart-contract-deployment)

## 3. Run Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test All Pages

| Page | URL | What to Test |
|------|-----|--------------|
| Landing | `/` | Hero animation, CTA buttons |
| Institution | `/institution` | CSV upload, issue certificates |
| Student | `/student` | Aadhar input, verify credentials |
| Employer | `/employer` | Filter candidates, pagination |
| Analytics | `/analytics` | Charts and insights |

## Common Tasks

### Run Linter

```bash
cd frontend
npm run lint:fix
```

### Build for Production

```bash
cd frontend
npm run build
npm run start
```

### Run Contract Tests

```bash
cd contracts
pytest tests/test_skillchain.py -v
```

### Format Code

```bash
cd frontend
npx prettier --write .
```

## Useful URLs

- **Local Frontend**: http://localhost:3000
- **Algod TestNet**: https://testnet-api.algonode.cloud
- **AlgoExplorer TestNet**: https://testnet.algoexplorer.io
- **Pera Wallet**: https://perawallet.app

## Troubleshooting

### "Cannot find module '@perawallet/connect'"
```bash
cd frontend
npm install @perawallet/connect
```

### "NEXT_PUBLIC_APP_ID is not set"
Ensure `.env.local` exists with all required variables

### "Wallet connection fails"
- Install Pera Wallet extension
- Switch MetaMask to TestNet
- Refresh page

### Charts not visible
- Run `npm install recharts` 
- Check browser console for errors
- Restart dev server

### TypeScript errors
```bash
npx tsc --noEmit
```

## Project Structure Quick Reference

```
frontend/
├── pages/           # Route pages
│   ├── index.tsx    ← Start here
│   ├── student.tsx
│   ├── institution.tsx
│   ├── employer.tsx
│   └── analytics.tsx
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── utils/           # Utilities (hashing, Algorand, PDF)
└── constants/       # Shared constants and config

contracts/
├── skillchain.py    # Smart contract
└── tests/           # Contract tests
```

## File Size Limits

Each component should be **under 200 lines** - if it's larger, split it up.

## What's Included (Zero Setup)

✅ TypeScript strict mode configured  
✅ Tailwind CSS with dark theme  
✅ Framer Motion animations ready  
✅ Zod validation schemas  
✅ Algorand integration  
✅ Error boundaries  
✅ ESLint + Prettier config  
✅ Smart contract with tests  

## Next Steps

1. **Modify components** - Edit files in `components/` and see hot reload
2. **Add pages** - Create new file in `pages/` for new route
3. **Update styles** - Edit `styles/globals.css` or component classes
4. **Test wallet** - Connect Pera Wallet and test flow
5. **Deploy** - Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Key Features to Explore

- **Animated Background**: Every page has Squares animation
- **Glassmorphic Cards**: Semi-transparent cards with glow effects
- **Responsive Design**: Mobile-first, works on all devices
- **Privacy-First**: Aadhar hashed client-side only
- **Smart Filtering**: Dynamic filters with real-time results

## Performance Tips

- Use `motion.div` for animations (not CSS)
- Lazy load images with Next.js Image component
- Memoize expensive calculations with `useMemo`
- Code-split pages automatically with Next.js
- Test with Lighthouse: `npm run build && npx lighthouse http://localhost:3000`

## Learning Resources

- [Algorand Docs](https://developer.algorand.org)
- [Beaker Framework](https://algorand-devrel.github.io/beaker/)
- [Next.js Guide](https://nextjs.org/learn)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## Getting Help

1. Check [README.md](./README.md) for detailed docs
2. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production setup
3. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
4. Check component examples in `components/SquaresBackground.tsx`

---

**Happy coding! 🚀**
