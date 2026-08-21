/**
 * routeCrypto.ts
 *
 * Provides URL-safe, reversible encryption/obfuscation for dynamic route parameters
 * (/profile/:encryptedId, /product/:encryptedId, /messages/:encryptedId).
 * Encrypts ID + create_date_time + PASSWORD_PEPPER to hide raw DB IDs.
 */

const PASSWORD_PEPPER = process.env.NEXT_PUBLIC_PASSWORD_PEPPER || 'c3VwZXJTZWNyZXRQZXBwZXJLZXkxMjM0NTY3OA==';

// Simple URL-safe Base64 encoding and decoding helpers
function toBase64Url(str: string): string {
  if (typeof btoa === 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64url');
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(str: string): string {
  // Pad if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  if (typeof atob === 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }
  return atob(base64);
}

// Reversible XOR mask to prevent plain Base64 inspection
const CIPHER_SALT = 0x5a;

function obfuscateRaw(rawStr: string): string {
  const chars = [];
  for (let i = 0; i < rawStr.length; i++) {
    const code = rawStr.charCodeAt(i) ^ CIPHER_SALT;
    chars.push(String.fromCharCode(code));
  }
  return toBase64Url(chars.join(''));
}

function deobfuscateRaw(encoded: string): string {
  try {
    const raw = fromBase64Url(encoded);
    const chars = [];
    for (let i = 0; i < raw.length; i++) {
      const code = raw.charCodeAt(i) ^ CIPHER_SALT;
      chars.push(String.fromCharCode(code));
    }
    const decodedStr = chars.join('');
    // If formatted as ID|createDateTime|pepper, extract ID
    if (decodedStr.includes('|')) {
      const parts = decodedStr.split('|');
      return parts[0].trim();
    }
    return decodedStr;
  } catch {
    return encoded;
  }
}

/**
 * Encodes a user ID + create_date_time + PASSWORD_PEPPER into an encrypted URL slug (e.g., u_...)
 */
export function encodeProfileSlug(userId: string | number, createDateTime?: string): string {
  const cleanId = String(userId || '').trim();
  if (!cleanId) return '';
  // If already a slug
  if (cleanId.startsWith('u_')) return cleanId;
  const payload = createDateTime ? `${cleanId}|${createDateTime}|${PASSWORD_PEPPER}` : `${cleanId}|${PASSWORD_PEPPER}`;
  return `u_${obfuscateRaw(payload)}`;
}

/**
 * Decodes an encrypted profile slug back to the database user ID.
 */
export function decodeProfileSlug(slug: string): string {
  if (!slug) return '';
  if (slug.startsWith('u_')) {
    return deobfuscateRaw(slug.slice(2));
  }
  return slug;
}

/**
 * Encodes a product ID + create_date_time + PASSWORD_PEPPER into an encrypted URL slug (e.g., p_...)
 */
export function encodeProductSlug(productId: string | number, createDateTime?: string): string {
  const cleanId = String(productId || '').trim();
  if (!cleanId) return '';
  // If already a slug
  if (cleanId.startsWith('p_')) return cleanId;
  const payload = createDateTime ? `${cleanId}|${createDateTime}|${PASSWORD_PEPPER}` : `${cleanId}|${PASSWORD_PEPPER}`;
  return `p_${obfuscateRaw(payload)}`;
}

/**
 * Decodes an encrypted product slug back to the database product ID.
 */
export function decodeProductSlug(slug: string): string {
  if (!slug) return '';
  if (slug.startsWith('p_')) {
    return deobfuscateRaw(slug.slice(2));
  }
  return slug;
}

/**
 * Encodes a chat/messages recipient ID into an encrypted slug (e.g. c_...)
 */
export function encodeChatSlug(sellerId: string | number, createDateTime?: string): string {
  const cleanId = String(sellerId || '').trim();
  if (!cleanId) return '';
  // If already a slug
  if (cleanId.startsWith('c_')) return cleanId;
  const payload = createDateTime ? `${cleanId}|${createDateTime}|${PASSWORD_PEPPER}` : `${cleanId}|${PASSWORD_PEPPER}`;
  return `c_${obfuscateRaw(payload)}`;
}

/**
 * Decodes an encrypted chat slug back to the recipient ID
 */
export function decodeChatSlug(slug: string): string {
  if (!slug) return '';
  if (slug.startsWith('c_') || slug.startsWith('u_')) {
    return deobfuscateRaw(slug.slice(2));
  }
  return slug;
}
