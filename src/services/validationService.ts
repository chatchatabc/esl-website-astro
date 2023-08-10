export function validatePhoneNumber(value: string) {
  return /^1(?:3(?:4[^9\D]|[5-9]\d)|5[^3-6\D]\d|7[28]\d|8[23478]\d|9[578]\d)\d{7}$/.test(
    value
  );
}
