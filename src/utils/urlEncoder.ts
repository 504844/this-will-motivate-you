const encodeSettings = (settings: {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
}): string => {
  // Convert gender to 2 bits
  const genderBits = { male: 0, female: 1, other: 2 }[settings.gender] || 2;
  
  // Pack all data into a single 32-bit number
  const yearOffset = settings.birthDate.getFullYear() - 1900;
  const month = settings.birthDate.getMonth();
  const day = settings.birthDate.getDate();
  
  // Pack bits into a single number
  const packed = 
    (genderBits << 30) |           // 2 bits for gender
    (yearOffset << 23) |           // 7 bits for year (0-127)
    (month << 19) |                // 4 bits for month (0-11)
    (day << 14) |                  // 5 bits for day (1-31)
    (settings.lifeExpectancy << 7) | // 7 bits for life expectancy (0-127)
    (settings.name.length & 0x7F);   // 7 bits for name length

  // Convert name to number using char codes
  const nameNum = settings.name.split('')
    .reduce((acc, char) => acc * 37 + (char.charCodeAt(0) % 37), 0);

  // Combine both numbers and convert to base36
  const combined = (BigInt(packed) << 64n) | BigInt(nameNum);
  return combined.toString(36).padStart(6, '0').slice(-6);
};

const decodeSettings = (encoded: string): {
  name: string;
  gender: string;
  birthDate: Date;
  lifeExpectancy: number;
} | null => {
  try {
    const combined = BigInt('0x' + parseInt(encoded, 36).toString(16));
    
    const packed = Number(combined >> 64n);
    const nameNum = Number(combined & ((1n << 64n) - 1n));

    // Extract components
    const genderBits = (packed >> 30) & 0x3;
    const yearOffset = (packed >> 23) & 0x7F;
    const month = (packed >> 19) & 0xF;
    const day = (packed >> 14) & 0x1F;
    const lifeExpectancy = (packed >> 7) & 0x7F;
    const nameLength = packed & 0x7F;

    // Convert gender back to string
    const genderMap = ['male', 'female', 'other'];
    const gender = genderMap[genderBits] || 'other';

    // Reconstruct name
    let remainingNameNum = nameNum;
    let name = '';
    for (let i = 0; i < nameLength; i++) {
      const charCode = (remainingNameNum % 37) + 65;
      name = String.fromCharCode(charCode) + name;
      remainingNameNum = Math.floor(remainingNameNum / 37);
    }

    return {
      name,
      gender,
      birthDate: new Date(yearOffset + 1900, month, day),
      lifeExpectancy
    };
  } catch (e) {
    return null;
  }
};

export { encodeSettings, decodeSettings };