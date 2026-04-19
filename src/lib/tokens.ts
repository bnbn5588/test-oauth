import { randomBytes } from "crypto";
import { prisma } from "./prisma";

const TOKEN_EXPIRY_HOURS = 24;

export async function generateVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Remove any existing token for this email before creating a new one
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  return token;
}

export async function validateVerificationToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return null;

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return null;
  }

  return record;
}

export async function deleteVerificationToken(token: string) {
  await prisma.verificationToken.deleteMany({ where: { token } });
}
