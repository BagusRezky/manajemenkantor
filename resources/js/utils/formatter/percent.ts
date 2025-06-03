/**
 * Helper function untuk format desimal ke persen
 * @param value - Nilai desimal (contoh: 20.00)
 * @param decimals - Jumlah desimal yang ditampilkan (default: 0)
 * @returns Format persen (contoh: "20%")
 */
export const formatToPercent = (value: number | string | null | undefined, decimals: number = 0): string => {
    if (value === null || value === undefined || value === '') return '';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';

    return `${numValue.toFixed(decimals)}%`;
};

/**
 * Helper function dengan Intl.NumberFormat (untuk format Indonesia)
 * @param value - Nilai desimal
 * @param decimals - Jumlah desimal
 * @returns Format persen dengan locale Indonesia
 */
export const formatToPercentIntl = (value: number | string | null | undefined, decimals: number = 0): string => {
    if (value === null || value === undefined || value === '') return '';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';

    return new Intl.NumberFormat('id-ID', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numValue / 100);
};

/**
 * Interface untuk parameter formatToPercentAdvanced
 */
interface PercentFormatOptions {
    decimals?: number;
    useIntl?: boolean;
    locale?: string;
    showSign?: boolean;
}

/**
 * Advanced percent formatter dengan berbagai opsi
 * @param value - Nilai desimal
 * @param options - Opsi formatting
 * @returns Format persen dengan opsi lanjutan
 */
export const formatToPercentAdvanced = (value: number | string | null | undefined, options: PercentFormatOptions = {}): string => {
    const { decimals = 0, useIntl = false, locale = 'id-ID', showSign = false } = options;

    if (value === null || value === undefined || value === '') return '';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';

    if (useIntl) {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            signDisplay: showSign ? 'always' : 'auto',
        });
        return formatter.format(numValue / 100);
    }

    const sign = showSign && numValue > 0 ? '+' : '';
    return `${sign}${numValue.toFixed(decimals)}%`;
};

/**
 * Utility untuk validasi nilai persen
 * @param value - Nilai yang akan divalidasi
 * @returns true jika valid, false jika tidak
 */
export const isValidPercentValue = (value: number | string | null | undefined): boolean => {
    if (value === null || value === undefined || value === '') return false;

    const numValue = parseFloat(value.toString());
    return !isNaN(numValue) && isFinite(numValue);
};

/**
 * Convert persen string kembali ke decimal
 * @param percentString - String persen (contoh: "20%")
 * @returns Nilai decimal atau null jika invalid
 */
export const percentToDecimal = (percentString: string): number | null => {
    if (!percentString || typeof percentString !== 'string') return null;

    const cleanString = percentString.replace('%', '').trim();
    const numValue = parseFloat(cleanString);

    return isNaN(numValue) ? null : numValue;
};
