/**
 * Format angka menjadi format mata uang Rupiah
 * @param {number | string | null | undefined} amount
 * @param {boolean} withSymbol - A
 * @returns {string} -
 */
export const formatRupiah = (amount: number | string | null | undefined, withSymbol: boolean = true): string => {
    const numAmount = Number(amount) || 0;

    // Format angka dengan pemisah ribuan dan 2 angka desimal
    const formattedAmount = numAmount
        .toLocaleString('id-ID', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        .replace('.', '.'); // Memastikan koma digunakan untuk desimal

    // Tambahkan simbol Rupiah jika diperlukan
    return withSymbol ? `Rp ${formattedAmount}` : formattedAmount;
};

/**
 * Format angka menjadi format mata uang Rupiah tanpa desimal
 * @param {number | string | null | undefined} amount - Jumlah yang akan diformat
 * @param {boolean} withSymbol - Apakah menampilkan simbol mata uang (Rp)
 * @returns {string} - String yang diformat (contoh: Rp 1.000.000)
 */
export const formatRupiahWithoutDecimal = (amount: number | string | null | undefined, withSymbol: boolean = true): string => {
    // Konversi input ke angka, defaultnya 0 jika null/undefined/NaN
    const numAmount = Number(amount) || 0;

    // Format angka dengan pemisah ribuan tanpa desimal
    const formattedAmount = numAmount.toLocaleString('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    // Tambahkan simbol Rupiah jika diperlukan
    return withSymbol ? `Rp ${formattedAmount}` : formattedAmount;
};
