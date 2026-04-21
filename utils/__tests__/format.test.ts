import { formatCurrency, formatLongDate } from '../format';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats GBP correctly', () => {
      expect(formatCurrency(1000, 'GBP')).toBe('£10.00');
      expect(formatCurrency(50, 'GBP')).toBe('£0.50');
      expect(formatCurrency(0, 'GBP')).toBe('£0.00');
    });

    it('formats EUR correctly', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€10.00');
      expect(formatCurrency(1575, 'EUR')).toBe('€15.75');
    });

    it('handles negative values correctly', () => {
      expect(formatCurrency(-1000, 'GBP')).toBe('-£10.00');
    });
  });

  describe('formatLongDate', () => {
    it('formats valid ISO dates correctly', () => {
      // Mocking locale might be needed if it varies, but assuming consistent behavior for test
      const date = '2024-10-21T10:00:00Z';
      const formatted = formatLongDate(date);
      expect(formatted).toContain('2024');
      expect(typeof formatted).toBe('string');
    });
  });
});
