import { db } from "./db";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID();
  const hash = await sha256(password + salt);
  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  storedPassword: string,
): Promise<boolean> {
  const [salt, hash] = storedPassword.split(":");
  const newHash = await sha256(password + salt);
  return newHash === hash;
}

export async function findUserByEmail(email: string) {
  return db.users.where("email").equals(email).first();
}

export async function createUser(
  email: string,
  password: string,
  name?: string,
  region?: string,
  currency?: string,
) {
  const hashedPassword = await hashPassword(password);
  const id = await db.users.add({
    email,
    password: hashedPassword,
    name: name || undefined,
    region: region || "US",
    currency: currency || "USD",
    createdAt: new Date(),
  });
  return db.users.get(id);
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.users.where("email").equals(email).first();
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
