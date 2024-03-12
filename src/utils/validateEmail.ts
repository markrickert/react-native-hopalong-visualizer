export const getEmailValidationError = (email: string) => {
  if (email.length === 0) return "can't be blank"
  if (email.length < 6) return "must be at least 6 characters"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "must be a valid email address"
  return ""
}
