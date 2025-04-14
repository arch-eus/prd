# End-to-End Encrypted CRDT Collaboration

This application implements a mnemonic-based E2E encryption scheme for secure multi-user collaboration using CRDTs (Conflict-free Replicated Data Types).

## How It Works

### Mnemonic-Based Security Model

1. **Unique Mnemonic Per Installation**
   - Each new installation generates a random mnemonic phrase (e.g. "abandon ability able about above...")
   - The mnemonic serves as both the encryption key and the room identifier

2. **Room ID Derivation**
   - Room IDs are cryptographically derived from the mnemonic using PBKDF2
   - This allows public identification of rooms without revealing the mnemonic

3. **End-to-End Encryption**
   - All task data is encrypted before being synchronized
   - Only users with the correct mnemonic can decrypt the data
   - The WebSocket server only sees encrypted data blobs

4. **Joining Existing Rooms**
   - To join an existing room, a user simply enters the mnemonic
   - This automatically connects them to the correct room and enables decryption
   - No additional authentication needed - possession of the mnemonic is the authentication

## Security Benefits

### Zero-Trust Model

The system uses a "trust the math, not the server" approach:

- **No Server Trust Required**: The server only routes encrypted messages
- **No Authentication Server**: No need for account creation or passwords
- **No Central Authority**: Decentralized collaboration model

### Privacy Enhancements

- **Metadata Minimization**: Room IDs are hashed, giving no information about contents
- **Anonymous Collaboration**: No personally identifying information shared
- **Resilient to Server Compromise**: Even if WebSocket server is compromised, data remains encrypted

## Implementation Details

### Key Cryptographic Components

1. **Mnemonic Generation**
   - Uses BIP-39-like word lists for human-readable entropy
   - 12+ words providing strong cryptographic security

2. **Key Derivation**
   - PBKDF2 with high iteration count to derive keys from mnemonic
   - Different salt values for room ID vs encryption key derivation

3. **Data Encryption**
   - AES-256-GCM for all sensitive task content
   - Authenticated encryption to prevent tampering
   - Non-sensitive metadata (IDs, timestamps) left unencrypted for CRDT functionality

### CRDT Integration

The system wraps encryption/decryption around standard CRDT operations:

1. **On Task Creation/Update**
   - Task is encrypted before being added to the CRDT
   - Only encrypted data is synchronized

2. **On Task Retrieval**
   - Encrypted task is retrieved from CRDT
   - Client attempts decryption with current mnemonic
   - Failed decryption indicates wrong mnemonic for this task

## User Experience

### Sharing Collaboration Access

To collaborate with others, users have several options:

1. **Direct Mnemonic Sharing**
   - Copy mnemonic phrase and share via secure channel (Signal, WhatsApp, etc.)

2. **Share Link**
   - Generate a share link containing the mnemonic
   - IMPORTANT: This link should only be shared via secure channels!

### Switching Between Rooms

Users can:
- **Join Different Rooms**: Enter a different mnemonic to switch rooms
- **Create New Rooms**: Generate a new mnemonic to create a fresh room

## Technical Notes

- **WebSocket Server**: Hosted separately from the main Vercel deployment
- **Persistent Storage**: Uses IndexedDB for local persistence
- **CRDT Implementation**: SyncedStore/Yjs with E2E encryption layer

## Security Considerations

- **Mnemonic Protection**: The mnemonic should be treated like a password
- **Private Sharing**: Always share mnemonics via private, secure channels
- **No Recovery**: If all collaborators lose the mnemonic, the data is unrecoverable