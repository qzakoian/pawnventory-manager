
export const formatUKPhoneNumber = (phoneNumber: string): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  let formatted = digitsOnly;
  if (digitsOnly.startsWith('44')) {
    formatted = digitsOnly.replace(/^44/, '');
    return `+44 ${formatted.slice(0, 4)} ${formatted.slice(4)}`;
  } else if (digitsOnly.startsWith('0')) {
    formatted = digitsOnly.slice(1);
    return `+44 ${formatted.slice(0, 4)} ${formatted.slice(4)}`;
  }
  return `+44 ${formatted.slice(0, 4)} ${formatted.slice(4)}`;
};

export const isValidUKPhoneNumber = (phoneNumber: string): boolean => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  if (digitsOnly === '') return true;
  
  const validLength = digitsOnly.length === 11 || (digitsOnly.length === 12 && digitsOnly.startsWith('44'));
  const ukMobilePattern = /^(0|44)?7\d{9}$/;
  
  return validLength && ukMobilePattern.test(digitsOnly);
};

export const isValidUKPostcode = (postcode: string): boolean => {
  if (!postcode) return true;
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode.trim());
};

export const formatPostcode = (postcode: string): string => {
  if (!postcode) return "";
  const cleaned = postcode.trim().toUpperCase();
  return cleaned.replace(/^(.+?)([0-9][A-Z]{2})$/, "$1 $2");
};
