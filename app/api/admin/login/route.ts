import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  const adminPassword = getAdminPassword();

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/"
  });
  return response;
}
