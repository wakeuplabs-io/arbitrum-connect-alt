export default function getDecimalCount(num: number) {
  if (num % 1 === 0) {
    return 0; // If the number is an integer, there are no decimal places
  }

  let count = 0;
  while (num % 1 !== 0) {
    num *= 10;
    count++;
  }
  return count;
}
