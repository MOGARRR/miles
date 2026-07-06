export class CanadaPostAuthError extends Error {
  constructor(message = "Canada Post authentication failed. Check API key and secret.") {
    super(message);
    this.name = "CanadaPostAuthError";
  }
}

export class CanadaPostInvalidAddressError extends Error {
  constructor(message = "Invalid Canadian postal code format.") {
    super(message);
    this.name = "CanadaPostInvalidAddressError";
  }
}

export class CanadaPostNoServicesError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "CanadaPostNoServicesError";
    this.code = code;
  }
}

export class CanadaPostUnavailableError extends Error {
  constructor(message = "Canada Post rating service is temporarily unavailable.") {
    super(message);
    this.name = "CanadaPostUnavailableError";
  }
}
