# Mini Blockchain TypeScript

An educational implementation of a blockchain in TypeScript to understand the fundamental concepts of this technology.

## 🚨 Project Status

> **⚠️ EDUCATIONAL PROJECT IN DEVELOPMENT** 

## What is this project?

This project is a simplified blockchain that demonstrates the core concepts of:

* **Chained blocks** with cryptographic hashes
* **Digitally signed transactions** using elliptic-curve cryptography
* **Integrity validation** with Merkle trees
* **Wallets** for managing public/private keys
* **Basic consensus** via signature validation

## 📋 Implementation Status

> **Note**: This is a learning project. All features, implementations, and architecture may evolve and change as I continue learning and improving my understanding of blockchain concepts.

### ✅ **Completed Features**

**🏗️ Core Blockchain**
- ✅ Block structure with SHA-256 hashing (`src/core/block.ts`)
- ✅ Blockchain with genesis and `addBlock()` functionality (`src/core/blockchain.ts`)
- ✅ Complete Merkle Tree implementation (`src/core/merkle.ts`)
- ✅ Chain integrity validation and verification

**🔐 Cryptography & Wallets**
- ✅ Complete transaction system (`src/wallet/transaction.ts`)
- ✅ Wallet with key generation (`src/wallet/wallet.ts`)
- ✅ Digital signatures with secp256k1
- ✅ Signature verification implemented

**💾 Data Persistence**
- ✅ SQLite storage implemented (`src/storage/storage.ts`)
- ✅ `saveBlock()` and `loadBlockchain()` functions
- ✅ Automatic persistence between executions
- ✅ Structured database schema

**🧪 Development Tools**
- ✅ Basic testing with Bun test framework
- ✅ Hot reload development server
- ✅ Biome linting and formatting

### 🚧 **In Development**

**🌐 REST API**
- ⚠️ HTTP server with Hono framework (`src/network/node.ts`)
- ⚠️ `GET /blocks` - Retrieve complete blockchain
- ⚠️ `POST /tx` - Submit transactions
- ❌ `GET /mempool` - View pending transactions
- ❌ `POST /mine` - Start mining process
- ❌ `GET /mine/status/{jobId}` - Check mining status (async)

### ❌ **Pending Features**

**🔗 P2P Networking**
- [ ] Basic structure created (`src/network/p2p.ts`)
- [ ] WebSocket implementation pending
- [ ] P2P message protocol pending
- [ ] Peer discovery system pending

**🤝 Distributed Consensus**
- [ ] Complete Proof-of-Work algorithm
- [ ] Node synchronization
- [ ] Fork conflict resolution
- [ ] Remote chain validation

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
├── core/           # Core blockchain logic
│   ├── blockchain.ts   # Main blockchain class with chain management
│   ├── block.ts        # Block class with hash calculation
│   └── merkle.ts       # Merkle tree implementation
├── wallet/         # Transaction and wallet management
│   ├── wallet.ts       # Wallet class with key generation
│   └── transaction.ts  # Transaction class with signature validation
├── storage/        # Data persistence
│   └── storage.ts      # SQLite functions for blocks
├── network/        # Networking and REST API
│   ├── routes/         # HTTP endpoints
│   │   ├── blocks.ts     # GET /blocks
│   │   ├── transactions.ts # POST /tx
│   │   ├── mempool.ts    # GET /mempool
│   │   └── mining.ts     # POST /mine, GET /mine/status
│   └── p2p.ts          # P2P (in development)
├── state/          # Global state
│   └── singleton.ts    # Shared blockchain instance
└── crypto/         # Cryptographic utilities
    └── hash.ts         # Hashing functions
```
