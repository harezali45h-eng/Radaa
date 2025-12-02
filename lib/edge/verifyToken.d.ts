export interface VerifyTokenResult {
  valid: boolean;
  // Payload shape mirrors the decoded JWT payload; it is intentionally loose here.
  payload: unknown | null;
}

export function verifyToken(token: string): Promise<VerifyTokenResult>;
