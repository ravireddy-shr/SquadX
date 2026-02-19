#!/bin/bash

# Deploy SkillChain Pro
# 1. Deploy smart contract to Algorand Testnet
# 2. Deploy frontend to Vercel

set -e

echo "🚀 SkillChain Pro Deployment"
echo "=============================="

# Step 1: Setup Algo environment
echo ""
echo "📦 Step 1: Setting up Algorand environment..."
cd contracts
if ! command -v algokit &> /dev/null; then
  echo "Installing AlgoKit..."
  pip install algokit
fi

# Step 2: Deploy smart contract
echo ""
echo "🔗 Step 2: Deploying smart contract..."
algokit init
algokit deploy

echo ""
echo "✅ Smart contract deployed!"
read -p "Enter your app ID: " APP_ID
read -p "Enter your ALGOD token: " ALGOD_TOKEN

# Step 3: Setup frontend
cd ../frontend
echo ""
echo "🎨 Step 3: Setting up frontend..."

# Create .env.local from .env.example
cp .env.example .env.local

# Update env vars
sed -i "s/NEXT_PUBLIC_APP_ID=/NEXT_PUBLIC_APP_ID=$APP_ID/" .env.local
sed -i "s/NEXT_PUBLIC_ALGOD_TOKEN=/NEXT_PUBLIC_ALGOD_TOKEN=$ALGOD_TOKEN/" .env.local

echo ""
echo "📋 Environment variables set in .env.local"

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Build frontend
echo ""
echo "🔨 Building frontend..."
npm run build

# Step 4: Deploy to Vercel
echo ""
echo "🌐 Step 4: Deploying to Vercel..."
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "=============================="
echo ""
echo "✅ Smart contract deployed to Algorand Testnet"
echo "✅ Frontend deployed to Vercel"
echo ""
echo "Next steps:"
echo "1. Verify smart contract on AlgoExplorer"
echo "2. Test frontend at your Vercel deployment URL"
echo "3. Configure institutional accounts"
