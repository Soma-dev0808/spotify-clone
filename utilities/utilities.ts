/**
 *
 * @param value Any value to be evaluated.
 * @returns True if value is neither undefined nor null.
 */

const checkNullOrUndefined = (value: any): boolean => {
  if (value === undefined || value === null) {
    throw Error('Server error. Unable to get accessTokenExpires');
  }

  return true;
};

export { checkNullOrUndefined };
