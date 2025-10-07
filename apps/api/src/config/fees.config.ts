/**
 * Fee Configuration for Wine Marketplace
 *
 * Commission structure designed to cover:
 * - Stripe payment processing fees (1.5% + €0.25 EU, 2.9% + €0.25 non-EU)
 * - Escrow service costs and buyer protection
 * - Platform maintenance and fraud prevention
 * - Insurance and dispute resolution
 */

export const FEES_CONFIG = {
  /**
   * Platform commission charged to seller
   * 8% of order subtotal
   * Industry comparison: Vinted (5%), eBay (12.9%), Catawiki wine (9%), Vivino (15%)
   */
  PLATFORM_FEE_PERCENTAGE: 0.08,

  /**
   * Buyer protection fee (fixed)
   * Covers escrow service and fraud prevention
   */
  BUYER_PROTECTION_FEE: 1.50,

  /**
   * Processing fee (fixed)
   * Covers Stripe fees and payment processing
   */
  PROCESSING_FEE: 0.50,

  /**
   * Free shipping threshold
   * Orders over this amount get free shipping
   */
  FREE_SHIPPING_THRESHOLD: 100,

  /**
   * Base shipping cost
   * Applied to orders under free shipping threshold
   */
  BASE_SHIPPING_COST: 5,

  /**
   * Additional shipping cost per extra item
   * Added for each item beyond the first
   */
  ADDITIONAL_ITEM_SHIPPING_COST: 2,
} as const;

/**
 * Calculate total fees for an order
 */
export interface FeeBreakdown {
  subtotal: number;
  platformFee: number;
  buyerProtectionFee: number;
  processingFee: number;
  shippingCost: number;
  totalAmount: number;
  sellerPayout: number;
}

/**
 * Calculate shipping cost based on order value and item count
 */
export function calculateShipping(subtotal: number, itemCount: number): number {
  if (subtotal >= FEES_CONFIG.FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return FEES_CONFIG.BASE_SHIPPING_COST +
         Math.max(0, itemCount - 1) * FEES_CONFIG.ADDITIONAL_ITEM_SHIPPING_COST;
}

/**
 * Calculate all fees for an order
 */
export function calculateFees(subtotal: number, itemCount: number): FeeBreakdown {
  // Platform fee (8% of subtotal)
  const platformFee = Number((subtotal * FEES_CONFIG.PLATFORM_FEE_PERCENTAGE).toFixed(2));

  // Fixed fees
  const buyerProtectionFee = FEES_CONFIG.BUYER_PROTECTION_FEE;
  const processingFee = FEES_CONFIG.PROCESSING_FEE;

  // Shipping cost
  const shippingCost = calculateShipping(subtotal, itemCount);

  // Total amount buyer pays
  const totalAmount = Number((
    subtotal +
    platformFee +
    buyerProtectionFee +
    processingFee +
    shippingCost
  ).toFixed(2));

  // Seller receives: subtotal - platformFee
  const sellerPayout = Number((subtotal - platformFee).toFixed(2));

  return {
    subtotal,
    platformFee,
    buyerProtectionFee,
    processingFee,
    shippingCost,
    totalAmount,
    sellerPayout,
  };
}
