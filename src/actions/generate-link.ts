"use server";

// =============================================================================
// Server Action: Generate Affiliate Link
// Detects platform via regex, calls mock affiliate service, generates short link.
// =============================================================================

import { Platform } from "@/types";

interface GenerateLinkResult {
  success: boolean;
  data?: {
    platform: Platform;
    original_url: string;
    affiliate_url: string;
    short_code: string;
    short_url: string;
    estimated_commission: string;
  };
  error?: string;
}

import {
    generateAffiliateLink,
    generateShortCode,
} from "@/lib/mock-affiliate";
import { checkRateLimit } from "@/lib/anti-fraud";

/** Platform detection patterns */
const PLATFORM_PATTERNS: { pattern: RegExp; platform: Platform }[] = [
    { pattern: /shopee\.(vn|co\.id|com\.my|ph|sg|co\.th)/i, platform: Platform.SHOPEE },
    { pattern: /lazada\.(vn|co\.id|com\.my|com\.ph|sg|co\.th)/i, platform: Platform.LAZADA },
    { pattern: /tiktok(shop)?\.(com|vn)/i, platform: Platform.TIKTOK },
    { pattern: /tiki\.vn/i, platform: Platform.TIKI },
];

/**
 * Detect which e-commerce platform a URL belongs to.
 */
function detectPlatform(url: string): Platform | null {
    for (const { pattern, platform } of PLATFORM_PATTERNS) {
        if (pattern.test(url)) return platform;
    }
    return null;
}

/**
 * Validate that the input is a proper URL.
 */
function isValidUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Main server action: converts a raw e-commerce URL into an affiliate short link.
 *
 * Flow:
 * 1. Validate URL format
 * 2. Rate limit check (10 requests/min per IP)
 * 3. Detect platform via regex
 * 4. Call mock affiliate service
 * 5. Generate internal short code
 * 6. Return result with short URL
 */
export async function generateLink(
    url: string,
    clientIp: string = "127.0.0.1"
): Promise<GenerateLinkResult> {
    try {
        // Step 1: Validate URL
        if (!url || !isValidUrl(url)) {
            return {
                success: false,
                error: "Please enter a valid URL (e.g., https://shopee.vn/product/123)",
            };
        }

        // Step 2: Rate limit check
        const rateCheck = checkRateLimit(clientIp);
        if (!rateCheck.allowed) {
            return {
                success: false,
                error: `Rate limit exceeded. Please wait ${Math.ceil(rateCheck.resetIn / 1000)}s before trying again.`,
            };
        }

        // Step 3: Detect platform
        const platform = detectPlatform(url);
        if (!platform) {
            return {
                success: false,
                error:
                    "Unsupported platform. We currently support Shopee, Lazada, TikTok Shop, and Tiki.",
            };
        }

        // Step 4: Call affiliate service (mock in dev)
        const affiliateResponse = await generateAffiliateLink(url, platform);

        // Step 5: Generate short code
        const shortCode = generateShortCode();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const shortUrl = `${appUrl}/r/${shortCode}`;

        // In production, we would save to DB here:
        // await supabase.from('tracking_links').insert({ ... });

        // Step 6: Return success
        return {
            success: true,
            data: {
                platform,
                original_url: url,
                affiliate_url: affiliateResponse.affiliate_url,
                short_code: shortCode,
                short_url: shortUrl,
                estimated_commission: `${affiliateResponse.commission_rate}%`,
            },
        };
    } catch (error) {
        console.error("[generateLink] Error:", error);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
}
