import { CanadaPostAuthError } from "./errors";
import { getCanadaPostConfig, resetCanadaPostConfigCache } from "./env";

type CachedToken = {
  accessToken: string;
  expiresAtMs: number;
};

let cachedToken: CachedToken | null = null;

/** Clears the in-memory OAuth token (useful for tests). */
export function resetCanadaPostTokenCache(): void {
  cachedToken = null;
}

/**
 * Fetches a Bearer token using OAuth2 client_credentials.
 * Key = client_id, Secret = client_secret from the Developer Portal.
 * Scope must match a value listed on the Rating API product page (Scopes section)
 * and be enabled on your app credentials — see CANADA_POST_OAUTH_SCOPE in .env.
 */
export async function getCanadaPostAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAtMs) {
    return cachedToken.accessToken;
  }

  const config = getCanadaPostConfig();
  const basicCredentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`,
  ).toString("base64");

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicCredentials}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: config.oauthScope,
    }).toString(),
  });

  const bodyText = await response.text();
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(bodyText) as Record<string, unknown>;
  } catch {
    throw new CanadaPostAuthError(
      `Canada Post token response was not JSON (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    const errorCode = typeof body.error === "string" ? body.error : null;
    const message =
      (typeof body.error_description === "string" && body.error_description) ||
      errorCode ||
      `Token request failed (HTTP ${response.status}).`;

    if (errorCode === "invalid_scope") {
      throw new CanadaPostAuthError(
        `${message} (scope sent: "${config.oauthScope}"). ` +
          "Check the Rating API Scopes section in the Developer Portal and your app " +
          "credential scope selection — the value must match exactly.",
      );
    }

    throw new CanadaPostAuthError(message);
  }

  const accessToken = body.access_token;
  if (typeof accessToken !== "string" || !accessToken) {
    throw new CanadaPostAuthError("Canada Post token response missing access_token.");
  }

  const expiresInSeconds =
    typeof body.expires_in === "number" ? body.expires_in : 3600;

  // Refresh one minute before expiry.
  cachedToken = {
    accessToken,
    expiresAtMs: Date.now() + expiresInSeconds * 1000 - 60_000,
  };

  return accessToken;
}

/** Reset both config and token caches (for scripts/tests). */
export function resetCanadaPostAuthState(): void {
  resetCanadaPostConfigCache();
  resetCanadaPostTokenCache();
}
