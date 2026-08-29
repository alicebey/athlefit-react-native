// Global funtion for format currency ID
export const currencyFormatter = (num: number) => {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
};
