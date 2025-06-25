export function toHex(value: number) {
  return `0x${value.toString(16)}`;
}

export function fromHex(value: string) {
  return parseInt(value.replace("0x", ""), 16);
}
