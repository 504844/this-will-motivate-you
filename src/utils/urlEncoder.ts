const encodeSettings = (settings: {
    name: string;
    gender: string;
    birthDate: Date;
    lifeExpectancy: number;
  }): string => {
    const data = {
      n: settings.name,
      g: settings.gender,
      b: settings.birthDate.toISOString(),
      l: settings.lifeExpectancy
    };
    
    return btoa(JSON.stringify(data));
  };
  
  const decodeSettings = (encoded: string) => {
    try {
      const decoded = JSON.parse(atob(encoded));
      return {
        name: decoded.n,
        gender: decoded.g,
        birthDate: new Date(decoded.b),
        lifeExpectancy: decoded.l
      };
    } catch (e) {
      return null;
    }
  };
  
  export { encodeSettings, decodeSettings };