export const formatIndonesianCurrency = (value: string) => {
  if (!value) return '';
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const terbilangRupiah = (amountStr: string): string => {
  const amount = parseInt(amountStr.replace(/\D/g, ''), 10);
  if (isNaN(amount) || amount === 0) return '';
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  const helper = (n: number): string => {
    if (n < 12) return units[n];
    if (n < 20) return helper(n - 10) + ' belas';
    if (n < 100) return helper(Math.floor(n / 10)) + ' puluh ' + helper(n % 10);
    if (n < 200) return 'seratus ' + helper(n - 100);
    if (n < 1000) return helper(Math.floor(n / 100)) + ' ratus ' + helper(n % 100);
    if (n < 2000) return 'seribu ' + helper(n - 1000);
    if (n < 1000000) return helper(Math.floor(n / 1000)) + ' ribu ' + helper(n % 1000);
    if (n < 1000000000) return helper(Math.floor(n / 1000000)) + ' juta ' + helper(n % 1000000);
    if (n < 1000000000000) return helper(Math.floor(n / 1000000000)) + ' miliar ' + helper(n % 1000000000);
    if (n < 1000000000000000) return helper(Math.floor(n / 1000000000000)) + ' triliun ' + helper(n % 1000000000000);
    return '';
  };
  const result = helper(amount).replace(/\s+/g, ' ').trim();
  return result ? `${result} rupiah` : '';
};
