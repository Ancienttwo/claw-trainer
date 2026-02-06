#!/bin/bash
# ClawTrainer.ai - Monorepo Project Initialization Script
# Plan: I + D (Web3 DApp + Astro Landing + Monorepo)
# Usage: bash init-project.sh

set -e

echo "🦞 ClawTrainer.ai - Project Initialization"
echo "============================================"

# ===== 1. Create directory structure =====
echo ""
echo "📁 Creating directory structure..."

# IMMUTABLE LAYER
mkdir -p specs/modules
mkdir -p contracts/modules
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e

# MUTABLE LAYER
mkdir -p src/modules

# SUPPORTING
mkdir -p docs/architecture
mkdir -p docs/api
mkdir -p docs/guides
mkdir -p docs/archives
mkdir -p scripts
mkdir -p ops/database
mkdir -p ops/secrets
mkdir -p artifacts

# Monorepo structure
mkdir -p apps/landing
mkdir -p apps/web
mkdir -p packages/contracts
mkdir -p packages/ui
mkdir -p packages/config
mkdir -p packages/types

# Create .gitkeep for ops
touch ops/.gitkeep
echo "# This folder contains sensitive operations files - DO NOT COMMIT" > ops/README.md

echo "✅ Directory structure created"

# ===== 2. Initialize root package.json =====
echo ""
echo "📦 Initializing root package.json..."

cat > package.json << 'PKGJSON'
{
  "name": "claw-trainer",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "format": "bunx biome format --write .",
    "check": "bunx biome check .",
    "dev:landing": "turbo dev --filter=@claw-trainer/landing",
    "dev:web": "turbo dev --filter=@claw-trainer/web",
    "build:landing": "turbo build --filter=@claw-trainer/landing",
    "build:web": "turbo build --filter=@claw-trainer/web"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "turbo": "^2.4.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
PKGJSON

echo "✅ Root package.json created"

# ===== 3. Create turbo.json =====
echo ""
echo "⚡ Creating turbo.json..."

cat > turbo.json << 'TURBO'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".astro/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
TURBO

echo "✅ turbo.json created"

# ===== 4. Create biome.json =====
echo ""
echo "🔧 Creating biome.json..."

cat > biome.json << 'BIOME'
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noDefaultExport": "error"
      },
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "files": {
    "ignore": ["node_modules", "dist", ".astro", "artifacts", "coverage"]
  }
}
BIOME

echo "✅ biome.json created"

# ===== 5. Create tsconfig.json =====
echo ""
echo "📝 Creating root tsconfig.json..."

cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "exclude": ["node_modules", "dist", "artifacts"]
}
TSCONFIG

echo "✅ tsconfig.json created"

# ===== 6. Create .env.example =====
echo ""
echo "🔐 Creating .env.example..."

cat > .env.example << 'ENV'
# BNB Chain
VITE_BSC_RPC_URL=https://bsc-dataseed.binance.org/
VITE_BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
VITE_WALLET_CONNECT_PROJECT_ID=

# Smart Contracts
VITE_IDENTITY_REGISTRY_ADDRESS=
VITE_REPUTATION_REGISTRY_ADDRESS=

# IPFS
VITE_PINATA_API_KEY=
VITE_PINATA_SECRET_KEY=

# Hardhat (DO NOT expose these in frontend)
DEPLOYER_PRIVATE_KEY=
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
BSCSCAN_API_KEY=
ENV

echo "✅ .env.example created"

# ===== 7. Install dependencies =====
echo ""
echo "📦 Installing dependencies..."
bun install

echo ""
echo "============================================"
echo "🦞 ClawTrainer.ai initialized!"
echo ""
echo "Next steps:"
echo "  1. cd apps/landing && bunx create-astro@latest . -- --template basics"
echo "  2. cd apps/web && bun create vite@latest . -- --template react-ts"
echo "  3. cd packages/contracts && npx hardhat init"
echo "  4. bun install"
echo "  5. bun run dev"
echo ""
echo "Happy hacking! Train your Molt. Own your Mind. 🦞"
