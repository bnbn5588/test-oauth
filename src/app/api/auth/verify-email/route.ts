import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateVerificationToken, deleteVerificationToken } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const base = new URL("/auth/verify-email", request.url);

  if (!token) {
    base.searchParams.set("error", "missing-token");
    return NextResponse.redirect(base);
  }

  try {
    const record = await validateVerificationToken(token);

    if (!record) {
      base.searchParams.set("error", "invalid-token");
      return NextResponse.redirect(base);
    }

    await prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    });

    await deleteVerificationToken(token);

    base.searchParams.set("success", "true");
    return NextResponse.redirect(base);
  } catch {
    base.searchParams.set("error", "server-error");
    return NextResponse.redirect(base);
  }
}
