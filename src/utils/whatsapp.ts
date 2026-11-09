/**
 * Normalizes a phone number string and builds a clickable WhatsApp (wa.me) URL.
 * Defaults to Colombian country code (+57) when a 10-digit local mobile number is provided without a country prefix.
 */
export function getWhatsAppUrl(rawPhone: string): string {
  const trimmed = rawPhone.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  const hasExplicitCountryPrefix = trimmed.startsWith('+') || digits.length > 10;
  const normalized = hasExplicitCountryPrefix ? digits : `57${digits}`;

  return `https://wa.me/${normalized}`;
}
