/**
 * Fee Configuration for Wine Marketplace (Frontend)
 *
 * This mirrors the backend configuration for displaying fee breakdowns to users
 */

export const FEES_CONFIG = {
  PLATFORM_FEE_PERCENTAGE: 0.08,       // 8% platform commission
  BUYER_PROTECTION_FEE: 1.50,          // €1.50 fixed buyer protection
  PROCESSING_FEE: 0.50,                // €0.50 fixed processing fee
  FREE_SHIPPING_THRESHOLD: 100,        // Free shipping over €100
  BASE_SHIPPING_COST: 5,               // €5 base shipping
  ADDITIONAL_ITEM_SHIPPING_COST: 2,    // €2 per additional item
} as const;

/**
 * Fee breakdown interface
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
