const intl = new Intl.NumberFormat('en-US', {
  style: 'decimal',
});
export const numberFormat = (value: number | string) => {
  return intl.format(Number(value));
};

const zeroDigits = [1_000_000_000, 1_000_000, 1_000];

const zeroDigitFormat = ['B', 'M', 'K'];

export const numberFormatZeroDigit = (value: number | string) => {
  const number = Number(value);

  for (let i = 0; i < zeroDigits.length; i++) {
    if (Math.floor(number / zeroDigits[i])) {
      return numberFormat(String(number / zeroDigits[i])) + zeroDigitFormat[i];
    }
  }

  return numberFormat(value);
};
