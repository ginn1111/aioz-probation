const intl = new Intl.NumberFormat('en-US', {
  style: 'decimal',
});
export const numberFormat = (value: string) => {
  return intl.format(Number(value));
};
