import { supabase } from "@/integrations/supabase/client";

// These product IDs must match what you set up in App Store Connect
export const PRODUCT_IDS = {
  monthly: "com.rhythm.premium.monthly",   // $4.99/mo
  yearly: "com.rhythm.premium.yearly",      // $49.99/yr
};

// Check if running inside a native Capacitor shell
function isNative(): boolean {
  return typeof (window as any).Capacitor !== "undefined" &&
    (window as any).Capacitor.isNativePlatform?.();
}

// Get the CdvPurchase.store instance (provided by cordova-plugin-purchase)
function getStore(): any {
  return (window as any).CdvPurchase?.store;
}

/**
 * Initialize the IAP store — call once on app start.
 * Registers products and sets up the receipt validation flow.
 */
export async function initializePurchases() {
  if (!isNative()) {
    console.log("[IAP] Not running natively — skipping IAP init");
    return;
  }

  const store = getStore();
  if (!store) {
    console.warn("[IAP] cordova-plugin-purchase not available");
    return;
  }

  const CdvPurchase = (window as any).CdvPurchase;

  // Register products
  store.register([
    {
      id: PRODUCT_IDS.monthly,
      type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
      platform: CdvPurchase.Platform.APPLE_APPSTORE,
    },
    {
      id: PRODUCT_IDS.yearly,
      type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
      platform: CdvPurchase.Platform.APPLE_APPSTORE,
    },
  ]);

  // When a purchase is approved, validate the receipt with our backend
  store.when().approved(async (transaction: any) => {
    try {
      await validateReceipt(transaction);
      transaction.finish();
    } catch (err) {
      console.error("[IAP] Receipt validation failed", err);
    }
  });

  // Initialize the store
  await store.initialize([CdvPurchase.Platform.APPLE_APPSTORE]);
}

/**
 * Get product info (price, title) from the store.
 */
export function getProduct(planId: "monthly" | "yearly"): any | null {
  const store = getStore();
  if (!store) return null;

  const productId = PRODUCT_IDS[planId];
  return store.get(productId) ?? null;
}

/**
 * Get the localized price string from Apple (e.g. "$4.99")
 */
export function getLocalizedPrice(planId: "monthly" | "yearly"): string | null {
  const product = getProduct(planId);
  if (!product?.pricing) return null;
  return product.pricing.price;
}

/**
 * Trigger a purchase for the given plan.
 */
export async function purchasePlan(planId: "monthly" | "yearly") {
  if (!isNative()) {
    // On web, show a message
    throw new Error("In-app purchases are only available in the mobile app");
  }

  const store = getStore();
  if (!store) {
    throw new Error("Purchase store not initialized");
  }

  const product = getProduct(planId);
  if (!product) {
    throw new Error(`Product ${planId} not found`);
  }

  // Find the offer and order it
  const offer = product.getOffer();
  if (!offer) {
    throw new Error(`No offer available for ${planId}`);
  }

  const result = await store.order(offer);
  if (result?.isError) {
    throw new Error(result.message || "Purchase failed");
  }
}

/**
 * Restore previous purchases (e.g. after reinstall).
 */
export async function restorePurchases() {
  if (!isNative()) return;

  const store = getStore();
  if (!store) return;

  await store.restorePurchases();
}

/**
 * Send the receipt to our backend for validation.
 */
async function validateReceipt(transaction: any) {
  const receiptData = transaction.nativePurchase?.appStoreReceipt ??
    transaction.nativePurchase?.receipt;

  if (!receiptData) {
    console.error("[IAP] No receipt data found on transaction");
    return;
  }

  const productId = transaction.products?.[0]?.id ?? transaction.productId;
  const transactionId =
    transaction.nativePurchase?.originalTransactionIdentifier ??
    transaction.transactionId;

  const { data, error } = await supabase.functions.invoke("validate-receipt", {
    body: {
      receipt_data: receiptData,
      platform: "ios",
      product_id: productId,
      transaction_id: transactionId,
    },
  });

  if (error) {
    throw new Error(`Receipt validation failed: ${error.message}`);
  }

  return data;
}
