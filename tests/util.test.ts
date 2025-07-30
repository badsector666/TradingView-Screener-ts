import { formatTechnicalRating } from '../src/util';

describe('formatTechnicalRating', () => {
  test('should return "Strong Buy" for ratings >= 0.5', () => {
    expect(formatTechnicalRating(0.5)).toBe('Strong Buy');
    expect(formatTechnicalRating(0.7)).toBe('Strong Buy');
    expect(formatTechnicalRating(1.0)).toBe('Strong Buy');
  });

  test('should return "Buy" for ratings >= 0.1 and < 0.5', () => {
    expect(formatTechnicalRating(0.1)).toBe('Buy');
    expect(formatTechnicalRating(0.3)).toBe('Buy');
    expect(formatTechnicalRating(0.49)).toBe('Buy');
  });

  test('should return "Neutral" for ratings >= -0.1 and < 0.1', () => {
    expect(formatTechnicalRating(-0.1)).toBe('Neutral');
    expect(formatTechnicalRating(0)).toBe('Neutral');
    expect(formatTechnicalRating(0.09)).toBe('Neutral');
  });

  test('should return "Sell" for ratings >= -0.5 and < -0.1', () => {
    expect(formatTechnicalRating(-0.5)).toBe('Sell');
    expect(formatTechnicalRating(-0.3)).toBe('Sell');
    expect(formatTechnicalRating(-0.11)).toBe('Sell');
  });

  test('should return "Strong Sell" for ratings < -0.5', () => {
    expect(formatTechnicalRating(-0.51)).toBe('Strong Sell');
    expect(formatTechnicalRating(-0.7)).toBe('Strong Sell');
    expect(formatTechnicalRating(-1.0)).toBe('Strong Sell');
  });

  test('should handle edge cases correctly', () => {
    expect(formatTechnicalRating(0.5)).toBe('Strong Buy');
    expect(formatTechnicalRating(0.1)).toBe('Buy');
    expect(formatTechnicalRating(-0.1)).toBe('Neutral');
    expect(formatTechnicalRating(-0.5)).toBe('Sell');
  });
});
