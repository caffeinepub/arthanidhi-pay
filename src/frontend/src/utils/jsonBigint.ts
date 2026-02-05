/**
 * JSON serialization/parsing helpers for handling bigint values in REST mode.
 * 
 * BigInt values are serialized as strings (e.g., "12345") and parsed back to BigInt.
 * This ensures compatibility with JSON while preserving the numeric precision needed
 * for financial calculations.
 */

export function stringifyWithBigInt(obj: any): string {
  return JSON.stringify(obj, (_, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
}

export function parseWithBigInt<T>(text: string): T {
  return JSON.parse(text, (key, value) => {
    // Convert string numbers that look like they should be bigints
    // This is a heuristic - in production, you'd want the API to indicate which fields are bigints
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      // Common bigint field names in our app
      const bigintFields = [
        'balance', 'amount', 'price', 'nav', 'change', 
        'dailyChange', 'oneDayChange', 'oneYearReturn',
        'monthlyCredits', 'monthlyDebits', 'timestamp', 
        'createdAt', 'id', 'startDate', 'endDate'
      ];
      
      if (bigintFields.includes(key)) {
        try {
          return BigInt(value);
        } catch {
          return value;
        }
      }
    }
    return value;
  });
}
