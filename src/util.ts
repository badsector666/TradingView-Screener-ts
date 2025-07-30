/**
 * Utility functions for TradingView Screener
 */

/**
 * Technical rating values
 */
export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

/**
 * Formats a numeric technical rating into a human-readable string
 * 
 * @param rating - Numeric rating value
 * @returns Human-readable technical rating
 * 
 * @example
 * ```typescript
 * formatTechnicalRating(0.7)   // 'Strong Buy'
 * formatTechnicalRating(0.2)   // 'Buy'
 * formatTechnicalRating(0.0)   // 'Neutral'
 * formatTechnicalRating(-0.2)  // 'Sell'
 * formatTechnicalRating(-0.7)  // 'Strong Sell'
 * ```
 * 
 * @see https://github.com/shner-elmo/TradingView-Screener/issues/12
 */
export function formatTechnicalRating(rating: number): TechnicalRating {
  if (rating >= 0.5) {
    return 'Strong Buy';
  } else if (rating >= 0.1) {
    return 'Buy';
  } else if (rating >= -0.1) {
    return 'Neutral';
  } else if (rating >= -0.5) {
    return 'Sell';
  } else {
    return 'Strong Sell';
  }
}
