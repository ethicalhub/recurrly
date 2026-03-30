// ─── Sanitizers ───────────────────────────────────────────────────────────────

export const sanitizeEmail = (v: string): string => v.trim().toLowerCase();

export const sanitizeName = (v: string): string =>
  v.trim().replace(/\s+/g, " ");

/** Strips every non-digit character — used live on OTP code input */
export const sanitizeOtpCode = (v: string): string => v.replace(/\D/g, "");

// ─── Validators ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (v: string): boolean => EMAIL_RE.test(v);

/** Clerk enforces its own password policy server-side; this is a fast client-side guard */
export const isValidPassword = (v: string): boolean => v.length >= 8;

// ─── Form-level validation ────────────────────────────────────────────────────

type FieldErrors = Record<string, string>;

export const validateSignInForm = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): FieldErrors => {
  const errors: FieldErrors = {};

  const cleanEmail = sanitizeEmail(email);
  if (!cleanEmail) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(cleanEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};

export const validateSignUpForm = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FieldErrors => {
  const errors: FieldErrors = {};

  if (!sanitizeName(firstName)) errors.firstName = "First name is required.";
  if (!sanitizeName(lastName)) errors.lastName = "Last name is required.";

  const cleanEmail = sanitizeEmail(email);
  if (!cleanEmail) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(cleanEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};
