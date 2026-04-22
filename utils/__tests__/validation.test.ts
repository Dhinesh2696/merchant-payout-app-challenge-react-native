import { isValidIBAN } from '../validation';

describe('isValidIBAN', () => {
  it('should return true for a valid GB IBAN', () => {
    // GB82 WEST 1234 5698 7654 32 is not necessarily valid due to checksum
    // A known valid GB IBAN format: GBkk BBBB SSSS SSCC CCCC CC
    // Let's use a real-looking one that passes MOD-97
    const validGB = 'GB29 NWBK 6016 1331 9268 19';
    expect(isValidIBAN(validGB)).toBe(true);
  });

  it('should return true for a valid Belgian IBAN', () => {
    // Valid Belgian IBAN: BE68 5390 0754 7034
    const validBE = 'BE68 5390 0754 7034';
    expect(isValidIBAN(validBE)).toBe(true);
  });

  it('should ignore spaces and case', () => {
    const validGB = 'gb29nwbk60161331926819';
    expect(isValidIBAN(validGB)).toBe(true);
  });

  it('should return false for IBAN with invalid length', () => {
    expect(isValidIBAN('GB29NWBK601613319268')).toBe(false); // Too short
    expect(isValidIBAN('FR763000600001123456789012345678')).toBe(false); // Too long
  });

  it('should return false for invalid characters', () => {
    expect(isValidIBAN('GB29 NWBK 6016 1331 9268 1!')).toBe(false);
  });

  it('should return false for invalid checksum', () => {
    // Changing the last digit should break the checksum
    const invalidGB = 'GB29 NWBK 6016 1331 9268 18';
    expect(isValidIBAN(invalidGB)).toBe(false);
  });

  it('should return false for empty or null', () => {
    expect(isValidIBAN('')).toBe(false);
    // @ts-ignore
    expect(isValidIBAN(null)).toBe(false);
  });
});
