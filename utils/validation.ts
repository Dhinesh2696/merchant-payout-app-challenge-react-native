/**
 * Validates an International Bank Account Number (IBAN).
 * Performs both regex format check and MOD-97 checksum verification.
 */
export const isValidIBAN = (iban: string): boolean => {
  if (!iban) return false;
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // 1. Basic format check: 2 letters (country), 2 digits (checksum), 11-30 alphanumeric
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;
  if (!regex.test(cleanIban)) return false;

  // 2. MOD-97 Checksum verification
  // Move first four characters to the end
  const arranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
  
  // Replace each letter with two digits (A=10, B=11, ..., Z=35)
  const numeric = arranged.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return (code - 55).toString();
    }
    return c;
  }).join('');

  // Perform modulo 97 check. Remainder should be 1.
  // Using BigInt because the numeric string can be up to 70 digits long.
  try {
    return BigInt(numeric) % 97n === 1n;
  } catch (e) {
    return false;
  }
};
