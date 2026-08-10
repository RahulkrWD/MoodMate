import { SetMetadata } from '@nestjs/common';

// Marks a route as accepting BOTH guests and logged-in users. The global
// guard still tries to decode a bearer token if one is present (so
// req.user is populated for logged-in callers), but never rejects the
// request for missing/invalid tokens.
export const IS_OPTIONAL_AUTH_KEY = 'isOptionalAuth';
export const OptionalAuth = () => SetMetadata(IS_OPTIONAL_AUTH_KEY, true);
