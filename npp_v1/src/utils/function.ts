const isValideDate = (date) => {
  return !isNaN(Date.parse(date));
};
const reviver = (_key: unknown, value: string) => {
  if (typeof value === 'string' && isValideDate(value)) {
    return new Date(value);
  }
  return value;
};
export const safeParse = (value) => {
  try {
    return JSON.parse(value, reviver);
  } catch (e) {
    return value;
  }
};
