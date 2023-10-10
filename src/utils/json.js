export const prefixObjectKeys = (object, prefix) => {
  return JSON.parse(JSON.stringify(object).replace(/(?<=[{,]{1}\s*")(.+?)(?="\s*:)/gim, `${prefix}$1`));
};
