#!/bin/bash
# East Coaster Tracker - Deployment Script
# This script walks through the deployment process step by step

set -e  # Exit on any error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   East Coaster Tracker - Deployment Helper                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking Prerequisites...${NC}"
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}"

echo "Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm -v)${NC}"

echo "Checking for Wrangler..."
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠ Wrangler not found. Installing globally...${NC}"
    npm install -g wrangler
fi
echo -e "${GREEN}✓ Wrangler found: $(wrangler --version)${NC}"
echo ""

# Step 2: Setup frontend
echo -e "${BLUE}Step 2: Setting Up Frontend...${NC}"
echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
    echo -e "${YELLOW}📝 Edit .env.local to set VITE_API_BASE${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi
echo ""

# Step 3: Build frontend
echo -e "${BLUE}Step 3: Building Frontend...${NC}"
echo "Building for production..."
npm run build
echo -e "${GREEN}✓ Frontend built to dist/${NC}"
echo ""

# Step 4: Deploy worker
echo -e "${BLUE}Step 4: Deploying Cloudflare Worker...${NC}"
read -p "Deploy worker.js to Cloudflare? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    wrangler deploy worker.js
    echo -e "${GREEN}✓ Worker deployed!${NC}"
    echo -e "${YELLOW}📝 Note the Worker URL and update .env.local if needed${NC}"
else
    echo -e "${YELLOW}⚠ Skipped worker deployment${NC}"
fi
echo ""

# Step 5: Summary
echo -e "${BLUE}Step 5: Summary${NC}"
echo -e "${GREEN}✓ Frontend build complete: dist/${NC}"
echo -e "${GREEN}✓ Worker deployed (if you chose to deploy)${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your worker URL if needed"
echo "2. Set up KV Namespace in Cloudflare Dashboard"
echo "3. Deploy dist/ folder to hosting service (Vercel, Netlify, etc.)"
echo ""
echo "For detailed instructions, see:"
echo "  - README.md"
echo "  - DEPLOYMENT.md"
echo ""
echo -e "${GREEN}✅ Ready to deploy!${NC}"
