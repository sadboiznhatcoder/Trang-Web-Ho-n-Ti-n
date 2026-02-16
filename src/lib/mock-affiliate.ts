// =============================================================================
// Mock Affiliate Service
// Simulates responses from AccessTrade/Ecomobi affiliate networks.
// In production, replace this with real API calls.
// =============================================================================

import { Platform } from "@/types";

interface MockAffiliateResponse {
  affiliate_url: string;
  commission_rate: number;
  platform: Platform;
  campaign_name: string;
}

/** Commission rates by platform (percentage of GMV) */
const COMMISSION_RATES: Record<Platform, { min: number; max: number }> = {
    [Platform.SHOPEE]: { min: 2.5, max: 8.0 },
    [Platform.LAZADA]: { min: 3.0, max: 10.0 },
    [Platform.TIKTOK]: { min: 4.0, max: 12.0 },
    [Platform.TIKI]: { min: 2.0, max: 7.0 },
};

/** Campaign names for visual fidelity */
const CAMPAIGN_NAMES: Record<Platform, string[]> = {
    [Platform.SHOPEE]: [
        "Shopee Super Sale",
        "Shopee Mall Deals",
        "Flash Sale Event",
    ],
    [Platform.LAZADA]: [
        "Lazada 12.12",
        "LazMall Exclusive",
        "Brand Mega Sale",
    ],
    [Platform.TIKTOK]: [
        "TikTok Live Shopping",
        "Creator Marketplace",
        "TikTok Mall",
    ],
    [Platform.TIKI]: [
        "Tiki Trading",
        "TikiNOW Fast Ship",
        "Official Store Deals",
    ],
};

/**
 * Simulates an affiliate network API call.
 * Returns a mock affiliate URL and commission rate.
 */
export async function generateAffiliateLink(
    originalUrl: string,
    platform: Platform
): Promise<MockAffiliateResponse> {
    // Simulate network latency (300-800ms)
    await new Promise((resolve) =>
        setTimeout(resolve, 300 + Math.random() * 500)
    );

    const rates = COMMISSION_RATES[platform];
    const commissionRate =
        Math.round((rates.min + Math.random() * (rates.max - rates.min)) * 10) / 10;

    const campaigns = CAMPAIGN_NAMES[platform];
    const campaignName = campaigns[Math.floor(Math.random() * campaigns.length)];

    // Generate a fake affiliate tracking parameter
    const trackingId = `CT${Date.now().toString(36).toUpperCase()}`;

    // Build the "affiliate URL" by appending tracking params
    const separator = originalUrl.includes("?") ? "&" : "?";
    const affiliateUrl = `${originalUrl}${separator}aff_id=${trackingId}&utm_source=cashbacktitan&utm_medium=affiliate`;

    return {
        affiliate_url: affiliateUrl,
        commission_rate: commissionRate,
        platform,
        campaign_name: campaignName,
    };
}

/**
 * Generates a unique short code for internal link shortening.
 * Format: 6-character alphanumeric code.
 */
export function generateShortCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
