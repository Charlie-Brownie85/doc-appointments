export const PayloadFromServer = (item: any): any => {
  if (Array.isArray(item)) {
    return item.map(PayloadFromServer);
  } if (typeof item === 'object' && item !== null) {
    return Object.keys(item).reduce((acc, key) => {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      acc[newKey] = PayloadFromServer(item[key]);
      return acc;
    }, {} as any);
  }
  return item;
};

export const PayloadToServer = (item: any): any => {
  if (Array.isArray(item)) {
    return item.map(PayloadToServer);
  } if (typeof item === 'object' && item !== null) {
    return Object.keys(item).reduce((acc, key) => {
      const newKey = key.charAt(0).toUpperCase() + key.slice(1);
      acc[newKey] = PayloadToServer(item[key]);
      return acc;
    }, {} as any);
  }
  return item;
};
