/**
 * Indian mobile numbers are exactly 10 digits, starting with 6 to 9.
 * `cleanPhone` keeps only digits, drops a pasted +91 or leading 0, and caps the length at 10,
 * so a number can never silently grow past 10 digits.
 */
export function cleanPhone(value: string): string {
  let d = value.replace(/\D/g, "");
  if (d.length > 10 && d.startsWith("91")) d = d.slice(2);
  else if (d.length > 10 && d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
}

export const isValidMobile = (digits: string) => /^[6-9]\d{9}$/.test(digits);
