import { Query, And, Or, DEFAULT_RANGE } from '../src/query';
import { col, Column } from '../src/column';

describe('Query', () => {
  describe('setMarkets', () => {
    const testCases: Array<[string[], string]> = [
      [['crypto'], 'https://scanner.tradingview.com/crypto/scan'],
      [['forex'], 'https://scanner.tradingview.com/forex/scan'],
      [['america'], 'https://scanner.tradingview.com/america/scan'],
      [['israel'], 'https://scanner.tradingview.com/israel/scan'],
      [['america', 'israel'], 'https://scanner.tradingview.com/global/scan'],
      [['crypto', 'israel'], 'https://scanner.tradingview.com/global/scan'],
    ];

    test.each(testCases)('should set markets %p to URL %s', (markets, expectedUrl) => {
      const query = new Query().setMarkets(...markets);
      
      expect(query.getUrl()).toBe(expectedUrl);
      expect(query.getQuery().markets).toEqual(markets);
    });
  });

  describe('limit and offset', () => {
    let originalRange: [number, number];

    beforeEach(() => {
      originalRange = [...DEFAULT_RANGE];
    });

    test('should handle limit and offset correctly', async () => {
      // Test default behavior
      const result1 = await new Query().getScannerData();
      expect(result1.data.length).toBeLessThanOrEqual(DEFAULT_RANGE[1]);

      // Test limit
      const result2 = await new Query().limit(10).getScannerData();
      expect(result2.data.length).toBeLessThanOrEqual(10);

      // Test offset
      const result3 = await new Query().offset(10).getScannerData();
      expect(result3.data.length).toBeLessThanOrEqual(DEFAULT_RANGE[1] - 10);

      // Test offset and limit combination
      const result4 = await new Query().offset(10).limit(15).getScannerData();
      expect(result4.data.length).toBeLessThanOrEqual(5);

      // Ensure DEFAULT_RANGE wasn't mutated
      expect(DEFAULT_RANGE).toEqual(originalRange);
    });
  });

  describe('orderBy', () => {
    test('should sort results correctly', async () => {
      // Test ascending order
      const result1 = await new Query()
        .select('close')
        .orderBy('close', true)
        .limit(20)
        .getScannerData();
      
      const closes1 = result1.data.map(row => row.close).filter(c => c != null);
      const sortedCloses1 = [...closes1].sort((a, b) => a - b);
      expect(closes1).toEqual(sortedCloses1);

      // Test descending order
      const result2 = await new Query()
        .select('close')
        .orderBy('close', false)
        .limit(20)
        .getScannerData();
      
      const closes2 = result2.data.map(row => row.close).filter(c => c != null);
      const sortedCloses2 = [...closes2].sort((a, b) => b - a);
      expect(closes2).toEqual(sortedCloses2);
    });
  });

  describe('percentage operations', () => {
    test('should handle above percentage correctly', async () => {
      const query = new Query()
        .select('close', 'price_52_week_low')
        .limit(1000);

      // Test that X > (X * 1) should always be false
      const result1 = await query
        .where(col('price_52_week_low').abovePct('price_52_week_low', 1))
        .getScannerData();
      expect(result1.totalCount).toBe(0);

      // Test that close is 10% higher than 52-week low
      const result2 = await query
        .where(col('close').abovePct('price_52_week_low', 1.1))
        .getScannerData();
      
      result2.data.forEach(row => {
        if (row.close != null && row.price_52_week_low != null) {
          expect(row.close).toBeGreaterThan(row.price_52_week_low * 1.1);
        }
      });

      // Test below percentage
      const result3 = await query
        .where(col('close').belowPct('price_52_week_low', 1.1))
        .getScannerData();
      
      result3.data.forEach(row => {
        if (row.close != null && row.price_52_week_low != null) {
          expect(row.close).toBeLessThan(row.price_52_week_low * 1.1);
        }
      });
    });
  });

  describe('between operations', () => {
    test('should handle between percentage correctly', async () => {
      const query = new Query()
        .select('close', 'VWAP')
        .limit(1000);

      const result1 = await query
        .where(col('close').betweenPct('VWAP', 1.1, 1.3))
        .getScannerData();
      
      result1.data.forEach(row => {
        if (row.close != null && row.VWAP != null) {
          expect(row.close).toBeGreaterThanOrEqual(row.VWAP * 1.1);
          expect(row.close).toBeLessThanOrEqual(row.VWAP * 1.3);
        }
      });

      const result2 = await query
        .where(col('close').notBetweenPct('VWAP', 1.1, 1.3))
        .getScannerData();
      
      result2.data.forEach(row => {
        if (row.close != null && row.VWAP != null) {
          const inRange = row.close >= row.VWAP * 1.1 && row.close <= row.VWAP * 1.3;
          expect(inRange).toBe(false);
        }
      });
    });
  });

  describe('error handling', () => {
    test('should handle HTTP errors correctly', async () => {
      await expect(
        new Query().limit(-5).getScannerData()
      ).rejects.toThrow();
    });
  });

  describe('AND/OR chaining', () => {
    test('should handle complex logical operations', async () => {
      const complexFilter = {
        operator: 'and',
        operands: [
          {
            operation: {
              operator: 'or',
              operands: [
                {
                  operation: {
                    operator: 'and',
                    operands: [
                      {
                        expression: {
                          left: 'type',
                          operation: 'equal',
                          right: 'stock',
                        },
                      },
                      {
                        expression: {
                          left: 'typespecs',
                          operation: 'has',
                          right: ['common'],
                        },
                      },
                    ],
                  },
                },
                {
                  operation: {
                    operator: 'and',
                    operands: [
                      {
                        expression: {
                          left: 'type',
                          operation: 'equal',
                          right: 'fund',
                        },
                      },
                      {
                        expression: {
                          left: 'typespecs',
                          operation: 'has_none_of',
                          right: ['etf'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      };

      const query = new Query().where2(
        And(
          Or(
            And(col('type').eq('stock'), col('typespecs').has(['common'])),
            And(col('type').eq('fund'), col('typespecs').hasNoneOf(['etf']))
          )
        )
      );

      expect(query.getQuery().filter2).toEqual(complexFilter);

      // Test that the API accepts this filtering
      const result = await query.getScannerData();
      expect(result.totalCount).toBeGreaterThan(0);
    });
  });

  describe('copy functionality', () => {
    test('should create independent copies', () => {
      const original = new Query()
        .select('close', 'volume')
        .where(col('close').gt(100))
        .limit(25);

      const copy = original.copy();
      
      // Modify the copy
      copy.select('open', 'high').limit(50);

      // Original should be unchanged
      expect(original.getQuery().columns).toEqual(['close', 'volume']);
      expect(original.getQuery().range?.[1]).toBe(25);
      
      // Copy should be modified
      expect(copy.getQuery().columns).toEqual(['open', 'high']);
      expect(copy.getQuery().range?.[1]).toBe(50);
    });
  });

  describe('equality', () => {
    test('should correctly compare queries', () => {
      const query1 = new Query().select('close').limit(10);
      const query2 = new Query().select('close').limit(10);
      const query3 = new Query().select('volume').limit(10);

      expect(query1.equals(query2)).toBe(true);
      expect(query1.equals(query3)).toBe(false);
    });
  });
});
