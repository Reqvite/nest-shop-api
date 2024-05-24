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
  MIN_LENGTH: ({length, label}: {length: number; label?: string}) =>
    `${label ? label : 'Minimum'} length should be ${length} characters`,
  INVALID_PHONE_FORMAT: (length?: number) => `Phone must contain ${length ? length : 12} digits`
};
