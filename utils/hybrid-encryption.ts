import crypto from "crypto";

// Encryption function
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // REPLACE THIS!
const SECONDARY_KEY = process.env.SECONDARY_KEY || ""; // New Layer Key

// First Layer: AES-256-CBC
function aesEncrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function aesDecrypt(text: string) {
  const [iv, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), Buffer.from(iv, "hex"));
  return decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
}

// Second Layer: AES-256-GCM
function secondaryEncrypt(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(SECONDARY_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

function secondaryDecrypt(text: string) {
  const [iv, encryptedText, authTag] = text.split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(SECONDARY_KEY, "hex"), Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  return decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
}

// Final Layered Encryption and Decryption
export function encrypt(text: string | undefined | null) {
  if (!text) return;
  const firstLayer = aesEncrypt(text);
  return secondaryEncrypt(firstLayer);
}

export function decrypt(text: string | undefined | null) {
  if (!text) return;
  console.log(text)
  const firstLayer = secondaryDecrypt(text);
  return aesDecrypt(firstLayer);
}
