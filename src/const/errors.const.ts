export const ErrorMessages = {
  INSUFFICIENT_QUANTITY: 'Insufficient quantity available for one or more products.',
  UNAUTHORIZED: 'Access is denied.',
  BAD_REQUEST: 'The request is invalid or malformed.',
  CONFLICT: 'The resource already exists or a conflict occurred.',
  NOT_FOUND: (label?: string): string => (label ? `${label} not found.` : 'The requested resource was not found.'),
  FORBIDDEN: "You don't have permission to access this resource.",
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred.',
  INVALID_OBJECT_ID: 'Invalid object ID provided.',
  USER_ALREADY_EXISTS: 'User already exists.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  INVALID_PARAMS: 'Invalid params.',
  ERROR: 'Error',
  INVALID_PHONE_FORMAT: (length?: number) => `Phone must contain ${length ? length : 12} digits`,
  EMAIL_REQUIRED: 'Email is required.',
  INVALID_EMAIL: 'Email must be a valid email.',
  PASSWORD_ERROR_MESSAGE: 'Password must contain at least 2 lowercase, 2 uppercase, 2 digits, and 2 special characters',
  PASSWORD_REQUIRED: 'Password is required.',
  IS_REQUIRED: (label: string) => `${label} is required.`,
  AT_LEAST_LENGTH: (length: number, label: string) => `${label} must be at least ${length} characters.`,
  AT_MOST_LENGTH: (length: number, label: string) => `${label} must be at most ${length} characters.`,
  MIN_LENGTH: ({length, label}: {length: number; label?: string}) =>
    `${label ? label : 'Minimum'} length should be ${length} characters.`,
  MIN_QUANTITY: (min: number) => `Quantity must be at least ${min}.`,
  OUT_OF_STOCK: 'Product is out of stock.',
  ITEMS_LEFT: (max: number) => `Only ${max} left.`,
  ACCEPT_PRIVACY: 'Please, accept the privacy policy.',
  MISSING_HEADER: (header: string) => `Missing ${header} header.`
};
