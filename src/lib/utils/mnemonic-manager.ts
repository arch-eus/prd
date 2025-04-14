/**
 * Mnemonic Manager
 * 
 * Handles generation, validation, and cryptographic operations for mnemonic phrases.
 * This creates a cryptographically secure way to:
 * 1. Generate unique mnemonics for new installations
 * 2. Derive room IDs from mnemonics (for SyncedStore WebSocket collaboration rooms)
 * 3. Derive encryption keys from mnemonics (for end-to-end encryption)
 * 4. Allow changing mnemonics to join existing collaboration rooms
 */

import { writable, get } from 'svelte/store';
import { encode as encodeBase64, decode as decodeBase64 } from '@stablelib/base64';

// BIP-39 word list (extended simplified version)
// In production, a full BIP-39 English word list of 2048 words would be better
const WORD_LIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake',
  'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge',
  'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain',
  'zero', 'zone', 'zoo'  // + many more in a real implementation
];

// Constants for cryptographic operations
const SALT = 'PRDrevive-CRDT-Sync'; // Fixed salt for deterministic derivation
const KEY_LENGTH = 32; // 256 bits
const ITERATIONS = 10000;
const ALGORITHM = 'AES-GCM';

// Store for the current mnemonic
export const currentMnemonic = writable<string | null>(null);

// Store for room ID (deterministically generated from mnemonic)
export const roomId = writable<string | null>(null);

// Initialize from storage if available
export async function initMnemonicFromStorage(): Promise<void> {
  try {
    const storedMnemonic = localStorage.getItem('prdrevive_mnemonic');
    if (storedMnemonic) {
      currentMnemonic.set(storedMnemonic);
      // Update room ID
      const id = await deriveRoomId(storedMnemonic);
      roomId.set(id);
    } else {
      // Generate new mnemonic for first-time users
      const newMnemonic = await generateMnemonic(5); // 5-word mnemonic is easier to remember
      currentMnemonic.set(newMnemonic);
      localStorage.setItem('prdrevive_mnemonic', newMnemonic);
      
      // Update room ID
      const id = await deriveRoomId(newMnemonic);
      roomId.set(id);
    }
  } catch (error) {
    console.error('Failed to initialize mnemonic:', error);
    // Fallback to generate a new one anyway
    const fallbackMnemonic = await generateMnemonic(5);
    currentMnemonic.set(fallbackMnemonic);
    
    // Update room ID
    try {
      const id = await deriveRoomId(fallbackMnemonic);
      roomId.set(id);
    } catch (e) {
      console.error('Failed to derive room ID:', e);
      roomId.set('default-room');
    }
  }
}

// Generate a cryptographically secure mnemonic phrase
export async function generateMnemonic(wordCount = 5): Promise<string> {
  try {
    // Generate random values using Web Crypto API
    const entropy = new Uint8Array(wordCount * 4); // More entropy per word
    window.crypto.getRandomValues(entropy);
    
    // Convert to words
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      // Use values from entropy array to select words
      const randomIndex = (entropy[i] + (entropy[i + wordCount % entropy.length] << 8)) % WORD_LIST.length;
      words.push(WORD_LIST[randomIndex < WORD_LIST.length ? randomIndex : 0]);
    }
    
    return words.join(' ');
  } catch (error) {
    console.error('Error generating mnemonic:', error);
    // Fallback to a simpler method if crypto API fails
    return Array(wordCount)
      .fill(0)
      .map(() => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)])
      .join(' ');
  }
}

// Change the current mnemonic (to join a different room/CRDT)
export async function changeMnemonic(newMnemonic: string): Promise<boolean> {
  if (!validateMnemonic(newMnemonic)) {
    console.warn('Invalid mnemonic format:', newMnemonic);
    return false;
  }
  
  try {
    currentMnemonic.set(newMnemonic);
    localStorage.setItem('prdrevive_mnemonic', newMnemonic);
    
    // Update room ID
    const id = await deriveRoomId(newMnemonic);
    console.log('Room ID derived:', id);
    roomId.set(id);
    
    // Reload the application to ensure clean state with new mnemonic
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('Failed to change mnemonic:', error);
    return false;
  }
}

// Validate a mnemonic phrase
export function validateMnemonic(mnemonic: string): boolean {
  if (!mnemonic) return false;
  
  const words = mnemonic.trim().split(/\s+/);
  
  // At least check that we have the right number of words and they're in our wordlist
  // A proper BIP-39 implementation would check the checksum too
  if (words.length < 3) {
    console.warn('Mnemonic has too few words:', words.length);
    return false;
  }
  
  // For easier testing/demo, only validate that words are from wordlist if we have enough words
  // in our simple wordlist to actually do that reliably
  if (WORD_LIST.length > 100) {
    // Basic validation - each word must be in the wordlist
    return words.every(word => WORD_LIST.includes(word.toLowerCase()));
  }
  
  return true;
}

// Derive a deterministic room ID from mnemonic
export async function deriveRoomId(mnemonic: string): Promise<string> {
  try {
    // Get key material for room ID (not for encryption)
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.digest(
      'SHA-256',
      encoder.encode(mnemonic + SALT + '-room')
    );
    
    // Convert to hex string - suitable for room identifiers
    return arrayBufferToHex(keyMaterial).substring(0, 16);
  } catch (error) {
    console.error('Error deriving room ID:', error);
    // Fallback to a hash-like value
    return btoa(mnemonic).slice(0, 16).replace(/[^a-zA-Z0-9]/g, '');
  }
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Derive key from mnemonic using PBKDF2 (via Web Crypto API)
async function deriveKeyFromMnemonic(mnemonic: string, salt: string, usage: KeyUsage[]): Promise<CryptoKey> {
  // Convert mnemonic and salt to key material
  const encoder = new TextEncoder();
  const mnemonicBuffer = encoder.encode(mnemonic);
  const saltBuffer = encoder.encode(salt);
  
  // Import mnemonic as raw key material
  const mnemonicKey = await window.crypto.subtle.importKey(
    'raw',
    mnemonicBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive actual key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    mnemonicKey,
    { name: 'AES-GCM', length: 256 },
    true,
    usage
  );
}

// Encrypt data using the mnemonic-derived key
export async function encryptData(data: any): Promise<string> {
  const mnemonic = get(currentMnemonic);
  if (!mnemonic) throw new Error('No mnemonic available for encryption');
  
  try {
    // Convert data to string if it's not already
    const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Get encryption key from mnemonic
    const key = await deriveKeyFromMnemonic(mnemonic, SALT + '-encryption', ['encrypt']);
    
    // Generate a random IV (initialization vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encodedData = new TextEncoder().encode(plaintext);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encodedData
    );
    
    // Combine IV and encrypted data in a JSON structure
    const result = {
      iv: encodeBase64(iv),
      data: encodeBase64(new Uint8Array(encryptedData))
    };
    
    return JSON.stringify(result);
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

// Decrypt data using the mnemonic-derived key
export async function decryptData(encryptedData: string): Promise<any> {
  const mnemonic = get(currentMnemonic);
  if (!mnemonic) throw new Error('No mnemonic available for decryption');
  
  try {
    // Parse the encrypted data
    const { iv, data } = JSON.parse(encryptedData);
    
    // Get decryption key from mnemonic
    const key = await deriveKeyFromMnemonic(mnemonic, SALT + '-encryption', ['decrypt']);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: decodeBase64(iv)
      },
      key,
      decodeBase64(data)
    );
    
    // Convert buffer to string
    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    
    // Parse JSON if the result is a JSON string
    try {
      return JSON.parse(decryptedText);
    } catch {
      // Return as is if it's not JSON
      return decryptedText;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

// Export object with all task data encryption/decryption utilities
export const mnemonicCrypto = {
  async encryptTask(task: any): Promise<any> {
    // Don't encrypt identifiers and non-sensitive metadata
    const { id, status, order, createdAt, updatedAt } = task;
    
    // Encrypt potentially sensitive data
    const encryptedData = await encryptData({
      title: task.title,
      description: task.description,
      notes: task.notes,
      labels: task.labels,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      completedAt: task.completedAt ? task.completedAt.toISOString() : null,
      recurrence: task.recurrence
    });
    
    // Return a task with encrypted data
    return {
      id,
      status,
      order,
      createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString(),
      updatedAt: updatedAt ? updatedAt.toISOString() : new Date().toISOString(),
      encrypted: encryptedData
    };
  },
  
  async decryptTask(encryptedTask: any): Promise<any> {
    try {
      // Extract non-encrypted fields
      const { id, status, order, createdAt, updatedAt } = encryptedTask;
      
      // Decrypt the sensitive data
      const decrypted = await decryptData(encryptedTask.encrypted);
      
      // Reconstruct the task object
      return {
        id,
        title: decrypted.title || '',
        description: decrypted.description || null,
        notes: decrypted.notes || null,
        status,
        labels: decrypted.labels || [],
        dueDate: decrypted.dueDate ? new Date(decrypted.dueDate) : null,
        completedAt: decrypted.completedAt ? new Date(decrypted.completedAt) : null,
        order,
        recurrence: decrypted.recurrence || null,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        updatedAt: updatedAt ? new Date(updatedAt) : new Date()
      };
    } catch (error) {
      console.error('Failed to decrypt task:', error);
      // Return a minimal task to avoid app crashes
      return {
        id: encryptedTask.id,
        title: '🔒 Encrypted (wrong key)',
        description: null,
        notes: null,
        status: encryptedTask.status || 'todo',
        labels: [],
        dueDate: null,
        completedAt: null,
        order: encryptedTask.order || 0,
        recurrence: null,
        createdAt: encryptedTask.createdAt ? new Date(encryptedTask.createdAt) : new Date(),
        updatedAt: encryptedTask.updatedAt ? new Date(encryptedTask.updatedAt) : new Date()
      };
    }
  }
};