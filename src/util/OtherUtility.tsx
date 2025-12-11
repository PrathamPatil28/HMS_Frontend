const arrayToCSV = (arr: any): string | null => {
    if (!Array.isArray(arr)) {
      try {
        arr = JSON.parse(arr);
      } catch (e) {
        return null;
      }
    }
  
    if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
  
    return arr.join(', ');
  };

  const convertArrayToDate = (arr: number[]) => {
    if (!Array.isArray(arr) || arr.length < 3) return null;
    return new Date(arr[0], arr[1] - 1, arr[2]);
};


  const safeParseArray = (value: any) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };


  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1)?.toLowerCase();
  }
  

  
  export{arrayToCSV , safeParseArray,capitalizeFirstLetter,convertArrayToDate}