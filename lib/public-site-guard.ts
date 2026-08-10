const privatePathPrefixes = [
  "/dashboard",
  "/protected",
  "/login",
  "/email-reset",
  "/password-reset",
  "/auth/callback",
  "/auth/confirm",
] as const;

export const isLegacyPrivatePath = (pathname: string): boolean =>
  privatePathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
