const SECRET = process.env.JWT_SECRET;

function base64UrlToUint8Array(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(base64Url.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64Url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToString(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(base64Url.length / 4) * 4, "=");
  const binary = atob(base64);
  return binary;
}

function stringToUint8Array(str) {
  return new TextEncoder().encode(str);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyToken(token) {
  try {
    if (!token || typeof token !== "string" || !SECRET) {
      return { valid: false, payload: null };
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, payload: null };
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const headerJson = base64UrlDecodeToString(encodedHeader);
    const payloadJson = base64UrlDecodeToString(encodedPayload);

    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);

    if (!header || header.alg !== "HS256") {
      return { valid: false, payload: null };
    }

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp < now) {
      return { valid: false, payload: null };
    }

    if (!crypto || !crypto.subtle) {
      return { valid: false, payload: null };
    }

    const key = await crypto.subtle.importKey(
      "raw",
      stringToUint8Array(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = stringToUint8Array(`${encodedHeader}.${encodedPayload}`);
    const signature = await crypto.subtle.sign("HMAC", key, data);
    const signatureBytes = new Uint8Array(signature);
    const computedSignature = uint8ArrayToBase64Url(signatureBytes);

    const isValid = timingSafeEqual(computedSignature, encodedSignature);

    if (!isValid) {
      return { valid: false, payload: null };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}
