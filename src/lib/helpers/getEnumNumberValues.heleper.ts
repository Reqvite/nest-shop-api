export const getEnumNumberValues = (object: object) => {
  return Object.values(object).filter((value) => typeof value === 'number');
};
