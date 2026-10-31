export function formatPrice(value: number): string {
  const number = value.toLocaleString("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${number} ₼`;
}