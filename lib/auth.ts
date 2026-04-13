import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "propertyhub-admin";

export function isAdminSession() {
  return cookies().get(ADMIN_SESSION_COOKIE)?.value === "1";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}
