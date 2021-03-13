import {isUrlSafeBase64} from 'url-safe-base64';

export function isUrlSafe(text: string): boolean {
  let isSafe: boolean | string = isUrlSafeBase64(text);
  if (typeof isSafe === 'boolean') return isSafe;
  if (typeof isSafe === 'string') return isSafe === 'true';

  throw new Error('not accounting for return type properly');
}

export function cleanName(name: string): string {
  name = name.trim().toLowerCase();
  name = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return name;
}

export class UserNameValidation {
  length(name: string): string {
    if (!name) return undefined;

    if (name.length > 16) return 'must be <=16 characters';
    if (name.length < 4) return 'must be >=4 characters';

    return undefined;
  }

  urlSafe(name: string) {
    if (isUrlSafe(name)) return undefined;

    return 'invalid name';
  }
}
