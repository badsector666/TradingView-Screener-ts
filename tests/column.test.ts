import { Column, col } from '../src/column';

describe('Column', () => {
  let column: Column;

  beforeEach(() => {
    column = new Column('test_field');
  });

  describe('constructor', () => {
    test('should create column with correct name', () => {
      expect(column.name).toBe('test_field');
    });
  });

  describe('comparison operations', () => {
    test('should create correct greater than filter', () => {
      const filter = column.gt(100);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'greater',
        right: 100,
      });
    });

    test('should create correct greater than or equal filter', () => {
      const filter = column.gte(100);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'egreater',
        right: 100,
      });
    });

    test('should create correct less than filter', () => {
      const filter = column.lt(100);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'less',
        right: 100,
      });
    });

    test('should create correct less than or equal filter', () => {
      const filter = column.lte(100);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'eless',
        right: 100,
      });
    });

    test('should create correct equal filter', () => {
      const filter = column.eq('value');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'equal',
        right: 'value',
      });
    });

    test('should create correct not equal filter', () => {
      const filter = column.ne('value');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'nequal',
        right: 'value',
      });
    });
  });

  describe('column comparison', () => {
    test('should handle comparison with another column', () => {
      const otherColumn = new Column('other_field');
      const filter = column.gt(otherColumn);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'greater',
        right: 'other_field',
      });
    });

    test('should handle comparison with column name string', () => {
      const filter = column.gt('other_field');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'greater',
        right: 'other_field',
      });
    });
  });

  describe('crosses operations', () => {
    test('should create correct crosses filter', () => {
      const filter = column.crosses('VWAP');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'crosses',
        right: 'VWAP',
      });
    });

    test('should create correct crosses above filter', () => {
      const filter = column.crossesAbove('VWAP');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'crosses_above',
        right: 'VWAP',
      });
    });

    test('should create correct crosses below filter', () => {
      const filter = column.crossesBelow('VWAP');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'crosses_below',
        right: 'VWAP',
      });
    });
  });

  describe('range operations', () => {
    test('should create correct between filter', () => {
      const filter = column.between(10, 20);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'in_range',
        right: [10, 20],
      });
    });

    test('should create correct not between filter', () => {
      const filter = column.notBetween(10, 20);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'not_in_range',
        right: [10, 20],
      });
    });

    test('should create correct isin filter', () => {
      const filter = column.isin(['value1', 'value2', 'value3']);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'in_range',
        right: ['value1', 'value2', 'value3'],
      });
    });

    test('should create correct not in filter', () => {
      const filter = column.notIn(['value1', 'value2']);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'not_in_range',
        right: ['value1', 'value2'],
      });
    });
  });

  describe('set operations', () => {
    test('should create correct has filter with string', () => {
      const filter = column.has('common');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'has',
        right: 'common',
      });
    });

    test('should create correct has filter with array', () => {
      const filter = column.has(['common', 'preferred']);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'has',
        right: ['common', 'preferred'],
      });
    });

    test('should create correct has none of filter', () => {
      const filter = column.hasNoneOf(['etf', 'reit']);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'has_none_of',
        right: ['etf', 'reit'],
      });
    });
  });

  describe('date range operations', () => {
    test('should create correct in day range filter', () => {
      const filter = column.inDayRange(0, 5);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'in_day_range',
        right: [0, 5],
      });
    });

    test('should create correct in week range filter', () => {
      const filter = column.inWeekRange(1, 4);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'in_week_range',
        right: [1, 4],
      });
    });

    test('should create correct in month range filter', () => {
      const filter = column.inMonthRange(1, 12);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'in_month_range',
        right: [1, 12],
      });
    });
  });

  describe('percentage operations', () => {
    test('should create correct above percentage filter', () => {
      const filter = column.abovePct('VWAP', 1.05);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'above%',
        right: ['VWAP', 1.05],
      });
    });

    test('should create correct below percentage filter', () => {
      const filter = column.belowPct('VWAP', 0.95);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'below%',
        right: ['VWAP', 0.95],
      });
    });

    test('should create correct between percentage filter', () => {
      const filter = column.betweenPct('EMA200', 1.1, 1.3);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'in_range%',
        right: ['EMA200', 1.1, 1.3],
      });
    });

    test('should create correct not between percentage filter', () => {
      const filter = column.notBetweenPct('EMA200', 1.1, 1.3);
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'not_in_range%',
        right: ['EMA200', 1.1, 1.3],
      });
    });
  });

  describe('pattern matching', () => {
    test('should create correct like filter', () => {
      const filter = column.like('apple');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'match',
        right: 'apple',
      });
    });

    test('should create correct not like filter', () => {
      const filter = column.notLike('apple');
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'nmatch',
        right: 'apple',
      });
    });
  });

  describe('null checks', () => {
    test('should create correct empty filter', () => {
      const filter = column.empty();
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'empty',
        right: null,
      });
    });

    test('should create correct not empty filter', () => {
      const filter = column.notEmpty();
      expect(filter).toEqual({
        left: 'test_field',
        operation: 'nempty',
        right: null,
      });
    });
  });

  describe('toString', () => {
    test('should return correct string representation', () => {
      expect(column.toString()).toBe('Column(test_field)');
    });
  });

  describe('col alias', () => {
    test('should create column instance', () => {
      const aliasColumn = col('alias_field');
      expect(aliasColumn).toBeInstanceOf(Column);
      expect(aliasColumn.name).toBe('alias_field');
    });
  });
});
