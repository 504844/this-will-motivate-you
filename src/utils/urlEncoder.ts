const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const toBase62 = (num: number): string => {
  let result = '';
  do {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  } while (num > 0);
  return result.padStart(2, '0');
};

const fromBase62 = (str: string): number => {
  return str.split('').reduce((acc, char) => acc * 62 + BASE62.indexOf(char), 0);
};

const encodeSettings = (settings: {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
}): string => {
  // Convert gender to number (0-2)
  const genderMap: { [key: string]: number } = { male: 0, female: 1, other: 2 };
  const genderNum = genderMap[settings.gender] || 2;

  // Get year offset (0-99, relative to 1950)
  const yearOffset = settings.birthDate.getFullYear() - 1950;
  
  // Get month (0-11)
  const month = settings.birthDate.getMonth();
  
  // Get day (1-31)
  const day = settings.birthDate.getDate();
  
  // Get life expectancy (40-120)
  const age = Math.min(120, Math.max(40, settings.lifeExpectancy)) - 40;

  // Pack values into numbers
  const num1 = (yearOffset << 4) | month;
  const num2 = (day << 3) | genderNum;
  const num3 = age;
  const num4 = settings.name.length;
  const num5 = settings.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3844;

  // Convert to base62
  return (
    toBase62(num1) +
    toBase62(num2) +
    toBase62(num3) +
    toBase62(num4) +
    toBase62(num5)
  );
};

const decodeSettings = (
  encoded: string
): {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
} | null => {
  try {
    if (encoded.length !== 10) return null;

    const nums = [
      fromBase62(encoded.slice(0, 2)),
      fromBase62(encoded.slice(2, 4)),
      fromBase62(encoded.slice(4, 6)),
      fromBase62(encoded.slice(6, 8)),
      fromBase62(encoded.slice(8, 10))
    ];

    const yearOffset = nums[0] >> 4;
    const month = nums[0] & 0xF;
    const day = nums[1] >> 3;
    const genderNum = nums[1] & 0x7;
    const age = nums[2] + 40;
    const nameLength = nums[3];
    const nameHash = nums[4];

    // Convert gender back to string
    const genderMap: { [key: number]: string } = {
      0: 'male',
      1: 'female',
      2: 'other'
    };

    // Generate a default name based on the hash
    const defaultName = `User${nameHash.toString(36)}`;

    return {
      name: defaultName.slice(0, nameLength),
      gender: genderMap[genderNum] || 'other',
      birthDate: new Date(1950 + yearOffset, month, day),
      lifeExpectancy: age
    };
  } catch (e) {
    return null;
  }
};

export { encodeSettings, decodeSettings };