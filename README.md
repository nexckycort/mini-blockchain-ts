# Mini Blockchain TypeScript

An educational implementation of a blockchain in TypeScript to understand the fundamental concepts of this technology.

## What is this project?

This project is a simplified blockchain that demonstrates the core concepts of:

* **Chained blocks** with cryptographic hashes
* **Digitally signed transactions** using elliptic-curve cryptography
* **Integrity validation** with Merkle trees
* **Wallets** for managing public/private keys
* **Basic consensus** via signature validation

## Features

✅ **Blockchain Core**

* Automatic creation of the genesis block
* Secure chaining using SHA-256 hashes
* Full chain validation

✅ **Transaction System**

* Digital signatures with secp256k1
* Automatic transaction validation
* Prevention of post-signature tampering

✅ **Cryptographic Wallets**

* Secure generation of private/public keys
* Transaction signing and verification
* Compatibility with cryptographic standards

✅ **Merkle Tree**

* Per-block transaction integrity
* Efficient verification without downloading the entire block

🚧 **P2P Network** (Work in progress)

* Node-to-node communication
* Blockchain synchronization

## Architecture

```
src/
├── core/              # Core blockchain logic
│   ├── blockchain.ts  # Chain management
│   ├── block.ts       # Block implementation
│   └── merkle.ts      # Merkle trees
├── wallet/            # Transaction system
│   ├── wallet.ts      # Wallets and signing
│   └── transaction.ts # Transactions
├── crypto/            # Cryptographic utilities
└── network/           # P2P network (in development)
```
