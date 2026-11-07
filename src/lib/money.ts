/**
 * Formats a number into Indian Rupee currency format (e.g., ₹4,85,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}`;
}

/**
 * Formats a raw number with Indian numbering grouping (without ₹ symbol)
 */
export function formatNumberIndian(amount: number): string {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compact Rupee format for tiles and chips (e.g., ₹1.25L, ₹50k)
 */
export function formatINRCompact(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k : k.toFixed(0)}k`;
  }
  return `₹${amount}`;
}

