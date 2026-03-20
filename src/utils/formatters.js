/**
 * Format a number as a dollar amount: $X.XX
 */
export function formatCurrency(amount) {
  return '$' + Math.abs(amount).toFixed(2);
}

/**
 * Format the food-left metric.
 * Returns "$X.XX" when under/at budget, or "$X.XX over" when exceeded.
 * No double-$ prefix.
 */
export function formatFoodLeft(spent, budget) {
  const diff = budget - spent;
  if (diff >= 0) {
    return '$' + diff.toFixed(2);
  }
  return '$' + Math.abs(diff).toFixed(2) + ' over';
}

/**
 * Sum an array of entry objects by their amount field.
 */
export function sumAmounts(entries) {
  return entries.reduce((acc, e) => acc + e.amount, 0);
}
