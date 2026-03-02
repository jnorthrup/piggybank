import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import type { Region } from "@prisma/client";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: string,
  password: string,
  name?: string,
  region?: string,
  currency?: string
) {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
      region: (region as Region) || "US",
      currency: currency || "USD",
    },
    select: { id: true, email: true, name: true, region: true, currency: true, createdAt: true },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return { id: user.id, email: user.email, name: user.name, region: user.region, currency: user.currency, createdAt: user.createdAt };
}