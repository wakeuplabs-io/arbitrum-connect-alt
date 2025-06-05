export default function shortenAddress(address: string | undefined | null) {
  if (!address || address.length < 8) return "...";

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
