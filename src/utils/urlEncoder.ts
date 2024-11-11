const encodeSettings = (settings: {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
}): string => {
  // Convert gender to number
  const genderMap: { [key: string]: number } = { male: 0, female: 1, other: 2 };
  
  // Convert all data to numbers where possible
  const date = settings.birthDate;
  const nums = [
    genderMap[settings.gender] || 2,
    date.getFullYear() - 1900, // Use offset from 1900 to save digits
    date.getMonth(),
    date.getDate(),
    settings.lifeExpectancy
  ];

  // Convert numbers to base36 for maximum compression
  const encoded = nums.map(n => n.toString(36)).join('') + '.' + settings.name;
  
  // Use URL-safe base64 encoding
  return btoa(encoded)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const decodeSettings = (encoded: string): {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
} | null => {
  try {
    // Restore base64 characters
    const base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const decoded = atob(base64);
    const [numbers, name] = decoded.split('.');

    // Parse the fixed-width number string
    const genderNum = parseInt(numbers[0], 36);
    const year = parseInt(numbers.slice(1, 3), 36) + 1900;
    const month = parseInt(numbers.slice(3, 4), 36);
    const day = parseInt(numbers.slice(4, 5), 36);
    const lifeExpectancy = parseInt(numbers.slice(5), 36);

    // Convert gender back to string
    const genderMap: { [key: number]: string } = { 0: 'male', 1: 'female', 2: 'other' };

    return {
      name,
      gender: genderMap[genderNum] || 'other',
      birthDate: new Date(year, month, day),
      lifeExpectancy
    };
  } catch (e) {
    return null;
  }
};

export { encodeSettings, decodeSettings };