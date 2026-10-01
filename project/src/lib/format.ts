const priceFormatter = new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 0 });

export const formatPrice = (value: number) => `${priceFormatter.format(value)} MT`;
