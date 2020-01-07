import crypto from 'crypto';
import { promisify } from 'util';

/**
 * Generates random bytes of a specified length and returns a buffer
 */
export const generateRandomBytes = promisify(crypto.randomBytes);
