/**
 * Utility functions for name formatting and capitalization
 */

/**
 * Capitalizes the first letter of each word in a name
 * @param name - The name to capitalize
 * @returns The capitalized name
 */
export function capitalizeName(name: string): string {
  if (!name || typeof name !== 'string') {
    return name || '';
  }

  return name
    .trim()
    .split(' ')
    .map(word => {
      if (!word) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Capitalizes first and last name separately
 * @param firstName - The first name
 * @param lastName - The last name
 * @returns Object with capitalized first and last names
 */
export function capitalizeNames(firstName: string, lastName: string): { firstName: string; lastName: string } {
  return {
    firstName: capitalizeName(firstName),
    lastName: capitalizeName(lastName)
  };
}

/**
 * Capitalizes a full name while preserving the structure
 * @param fullName - The full name to capitalize
 * @returns The capitalized full name
 */
export function capitalizeFullName(fullName: string): string {
  return capitalizeName(fullName);
}
