/**
 * Utility to format numbers cleanly without redundant trailing zeros.
 *
 * Examples:
 *   formatCleanNumber(1.0) => "1"
 *   formatCleanNumber(1.2000) => "1.2"
 *   formatCleanNumber(1.6000) => "1.6"
 *   formatCleanNumber(1.23575) => "1.23575"
 *   formatCleanNumber(-2.0) => "-2"
 *   formatCleanNumber("1.2000") => "1.2"
 */
export function formatCleanNumber(
  val: number | string | null | undefined,
  maxDecimals = 6
): string {
  if (val === null || val === undefined) return '';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return String(val);

  const fixed = num.toFixed(maxDecimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

export default formatCleanNumber;
