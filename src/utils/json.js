export const prefixObjectKeys = (object, prefix) => {
  return JSON.parse(JSON.stringify(object).replace(/(?<=[{,]{1}\s*")(.+?)(?="\s*:)/gim, `${prefix}$1`));
};

export const createEnum = (constantArray) =>
  constantArray.reduce((acc, val) => {
    acc[val] = val;
    return acc;
  }, {});
