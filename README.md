# Mini Blockchain TypeScript

An educational implementation of a blockchain in TypeScript to understand the fundamental concepts of this technology.

## 🚨 Project Status

> **⚠️ EDUCATIONAL PROJECT IN DEVELOPMENT** 

## What is this project?

This project is a simplified blockchain that demonstrates the core concepts of:

* **Chained blocks** with cryptographic hashes and Proof-of-Work
* **Digitally signed transactions** using elliptic-curve cryptography (secp256k1)
* **Integrity validation** with Merkle trees
* **Wallets** for managing public/private keys
* **Mining consensus** via Proof-of-Work with configurable difficulty
* **Persistent storage** with SQLite database
* **REST API** for blockchain interaction

## 📋 Implementation Status

> **Note**: This is a learning project. All features, implementations, and architecture may evolve and change as I continue learning and improving my understanding of blockchain concepts.

### ✅ **Completed Features**

**🏗️ Core Blockchain**
- ✅ Block structure with SHA-256 hashing (`src/core/block.ts`)
- ✅ **Complete Proof-of-Work mining** with configurable difficulty (`src/config/mining.ts`)
- ✅ Mining algorithm with nonce iteration and target validation
- ✅ Blockchain with genesis and `addBlock()` functionality (`src/core/blockchain.ts`)
- ✅ Complete Merkle Tree implementation with integrity validation (`src/core/merkle.ts`)
- ✅ Chain integrity validation and verification across all blocks

**🔐 Cryptography & Wallets**
- ✅ Complete transaction system with signature validation (`src/wallet/transaction.ts`)
- ✅ Wallet with secure key generation (`src/wallet/wallet.ts`)
- ✅ Digital signatures with secp256k1 elliptic curve
- ✅ Signature verification and transaction validation
- ✅ Cryptographic hash utilities (`src/crypto/hash.ts`)

**💾 Data Persistence**
- ✅ **Robust SQLite storage** with error handling (`src/storage/storage.ts`)
- ✅ `saveBlock()` and `loadBlockchain()` with automatic recovery
- ✅ Automatic persistence between executions
- ✅ **Isolated test database** environment for safe testing
- ✅ Blockchain corruption detection and recovery

**🌐 REST API**
- ✅ **HTTP server with Hono framework** (`src/network/node.ts`)
- ✅ CORS and logging middleware configured
- ✅ `GET /health` - Server health check
- ✅ `GET /blocks` - Retrieve complete blockchain with validation
- ✅ `POST /tx` - Submit transactions with schema validation
- ✅ **Singleton pattern** for shared blockchain state (`src/state/singleton.ts`)
- ✅ **Mempool implementation** for pending transactions (`src/state/mempool.ts`)

### 🚧 **In Development**

**🌐 REST API - Mining Endpoints**
- ❌ `POST /mine` - Start mining process with mempool transactions
- ❌ `GET /mempool` - View pending transactions (mempool already implemented)
- ❌ `GET /mine/status/{jobId}` - Check mining status (async mining)

**🧪 Testing Coverage**
- ❌ **Unit tests for Wallet/Transaction** - Dedicated test suites
- ❌ **API integration tests** - Test REST endpoints with real requests
- ❌ **End-to-end tests** - Complete workflow validation

### ❌ **Pending Features**

**🔗 P2P Networking**
- [ ] Basic structure created (`src/network/p2p.ts`)
- [ ] WebSocket implementation pending
- [ ] P2P message protocol pending
- [ ] Peer discovery system pending

**🤝 Distributed Consensus**
- [ ] Node synchronization and chain comparison
- [ ] Fork conflict resolution
- [ ] Remote chain validation
- [ ] Consensus algorithm for multiple nodes

**📊 Advanced Functionality**
- [ ] Mempool with fee prioritization
- [ ] Dynamic fee system
- [ ] Optimized balance caching
- [ ] Interactive web explorer
- [ ] SPV (Simple Payment Verification) implementation

**🔒 Security & Production**
- [ ] Rate limiting for APIs
- [ ] Authentication system
- [ ] Deterministic serialization
- [ ] Complete balance validation in APIs
- [ ] Security audit implementation

## 🏗️ Architecture

```
src/
├── core/                   # Core blockchain logic
│   ├── blockchain.ts           # Main blockchain class with validation
│   ├── block.ts               # Block class with Proof-of-Work mining
│   ├── merkle.ts              # Merkle tree for transaction integrity
│   ├── blockchain.test.ts     # Blockchain validation tests
│   ├── block.test.ts          # Block creation and mining tests  
│   ├── merkle.test.ts         # Merkle tree tests
│   └── mining.test.ts         # Proof-of-Work mining tests
├── config/                 # Configuration management
│   ├── env.ts                 # Environment configuration
│   └── mining.ts              # Mining difficulty and PoW config
├── wallet/                 # Transaction and wallet management
│   ├── wallet.ts              # Wallet with secp256k1 key generation
│   └── transaction.ts         # Signed transactions with validation
├── storage/                # Data persistence layer
│   └── storage.ts             # SQLite with test isolation
├── network/                # HTTP API and networking
│   ├── node.ts                # Hono server with middleware
│   ├── routes/                # REST API endpoints
│   │   ├── blocks.ts              # GET /blocks - blockchain retrieval
│   │   └── txs/                   # Transaction endpoints
│   │       ├── transactions.ts       # POST /tx - transaction submission
│   │       └── schema.ts             # Request validation schemas
│   └── p2p.ts                 # P2P networking (structure only)
├── state/                  # Global application state
│   ├── singleton.ts           # Shared blockchain instance
│   └── mempool.ts             # Pending transactions pool
├── crypto/                 # Cryptographic utilities
│   └── hash.ts                # SHA-256 and hashing functions
└── index.ts                # Application entry point
```

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Run development server (http://localhost:3000)
bun run dev

# Run tests
bun test

# Check code quality
bun run check
```
