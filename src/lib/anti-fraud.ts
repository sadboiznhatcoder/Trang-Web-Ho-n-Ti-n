// =============================================================================
// Anti-Fraud Module
// Rate limiting + self-referral detection (device fingerprinting).
// Uses in-memory store for dev; replace with Upstash/Vercel KV in production.
// =============================================================================

/** In-memory rate limit store: IP -> { count, windowStart } */
const rateLimitStore = new Map<
    string,
    { count: number; windowStart: number }
>();

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 link generations per minute per IP

/**
 * Check if an IP has exceeded the rate limit for link generation.
 * Returns { allowed: boolean, remaining: number, resetIn: number }
 */
export function checkRateLimit(ip: string): {
    allowed: boolean;
    remaining: number;
    resetIn: number;
} {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
        // New window
        rateLimitStore.set(ip, { count: 1, windowStart: now });
        return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW };
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        const resetIn = RATE_LIMIT_WINDOW - (now - entry.windowStart);
        return { allowed: false, remaining: 0, resetIn };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: RATE_LIMIT_MAX - entry.count,
        resetIn: RATE_LIMIT_WINDOW - (now - entry.windowStart),
    };
}

/**
 * Device fingerprint for fraud detection.
 * Stores link creator's IP + User-Agent.
 */
export interface DeviceFingerprint {
    ip: string;
    userAgent: string;
    timestamp: number;
}

/** In-memory store for link creator fingerprints: linkId -> fingerprint */
const fingerprintStore = new Map<string, DeviceFingerprint>();

export function storeCreatorFingerprint(
    linkId: string,
    fingerprint: DeviceFingerprint
): void {
    fingerprintStore.set(linkId, fingerprint);
}

/**
 * Check if a purchase click is a potential self-referral fraud.
 * Flags if the purchaser's IP matches the link creator's IP.
 */
export function checkSelfReferral(
    linkId: string,
    purchaserIp: string
): { isFraud: boolean; reason?: string } {
    const creator = fingerprintStore.get(linkId);
    if (!creator) return { isFraud: false };

    if (creator.ip === purchaserIp) {
        return {
            isFraud: true,
            reason: `Self-referral detected: Purchase IP (${purchaserIp}) matches link creator IP`,
        };
    }

    return { isFraud: false };
}
