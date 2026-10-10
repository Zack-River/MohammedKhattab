export function isValidEmail(email: string, maximum: number) {
  return email.length <= maximum && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
