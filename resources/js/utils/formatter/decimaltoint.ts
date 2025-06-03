/**
 * Enum untuk jenis pembulatan
 */
export enum RoundingMethod {
    ROUND = 'round', // Pembulatan normal (0.5 ke atas)
    FLOOR = 'floor', // Pembulatan ke bawah
    CEIL = 'ceil', // Pembulatan ke atas
    TRUNC = 'trunc', // Potong desimal tanpa pembulatan
}

/**
 * Interface untuk opsi formatting angka
 */
interface NumberFormatOptions {
    decimals?: number;
    roundingMethod?: RoundingMethod;
    thousandSeparator?: boolean;
    locale?: string;
    currency?: boolean;
    currencySymbol?: string;
}

/**
 * Pembulatan dasar dengan berbagai metode
 * @param value - Nilai decimal yang akan dibulatkan
 * @param method - Metode pembulatan (default: ROUND)
 * @returns Angka yang sudah dibulatkan
 */
export const roundNumber = (value: number | string | null | undefined, method: RoundingMethod = RoundingMethod.ROUND): number | null => {
    if (value === null || value === undefined || value === '') return null;

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return null;

    switch (method) {
        case RoundingMethod.ROUND:
            return Math.round(numValue);
        case RoundingMethod.FLOOR:
            return Math.floor(numValue);
        case RoundingMethod.CEIL:
            return Math.ceil(numValue);
        case RoundingMethod.TRUNC:
            return Math.trunc(numValue);
        default:
            return Math.round(numValue);
    }
};

/**
 * Format decimal ke angka bulat (pembulatan normal)
 * @param value - Nilai decimal
 * @returns String angka bulat atau kosong jika invalid
 */
export const formatToInteger = (value: number | string | null | undefined): string => {
    const rounded = roundNumber(value, RoundingMethod.ROUND);
    return rounded !== null ? rounded.toString() : '';
};

/**
 * Format decimal dengan kontrol pembulatan dan desimal
 * @param value - Nilai decimal
 * @param decimals - Jumlah desimal yang diinginkan (default: 0)
 * @param roundingMethod - Metode pembulatan (default: ROUND)
 * @returns String angka yang sudah diformat
 */
export const formatDecimal = (
    value: number | string | null | undefined,
    decimals: number = 0,
    roundingMethod: RoundingMethod = RoundingMethod.ROUND,
): string => {
    if (value === null || value === undefined || value === '') return '';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';

    // Jika decimals = 0, gunakan pembulatan integer
    if (decimals === 0) {
        const rounded = roundNumber(numValue, roundingMethod);
        return rounded !== null ? rounded.toString() : '';
    }

    // Untuk desimal > 0, gunakan toFixed dengan pembulatan
    const multiplier = Math.pow(10, decimals);
    let rounded: number;

    switch (roundingMethod) {
        case RoundingMethod.ROUND:
            rounded = Math.round(numValue * multiplier) / multiplier;
            break;
        case RoundingMethod.FLOOR:
            rounded = Math.floor(numValue * multiplier) / multiplier;
            break;
        case RoundingMethod.CEIL:
            rounded = Math.ceil(numValue * multiplier) / multiplier;
            break;
        case RoundingMethod.TRUNC:
            rounded = Math.trunc(numValue * multiplier) / multiplier;
            break;
        default:
            rounded = Math.round(numValue * multiplier) / multiplier;
    }

    return rounded.toFixed(decimals);
};

/**
 * Format angka dengan pemisah ribuan
 * @param value - Nilai angka
 * @param locale - Locale untuk formatting (default: 'id-ID')
 * @returns String angka dengan pemisah ribuan
 */
export const formatWithThousandSeparator = (value: number | string | null | undefined, locale: string = 'id-ID'): string => {
    if (value === null || value === undefined || value === '') return '';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';

    return new Intl.NumberFormat(locale).format(numValue);
};

/**
 * Format angka ke currency (Rupiah)
 * @param value - Nilai angka
 * @param options - Opsi formatting
 * @returns String format currency
 */
export const formatToCurrency = (
    value: number | string | null | undefined,
    options: {
        decimals?: number;
        symbol?: string;
        locale?: string;
        roundingMethod?: RoundingMethod;
    } = {},
): string => {
    const { decimals = 0, symbol = 'Rp', locale = 'id-ID', roundingMethod = RoundingMethod.ROUND } = options;

    if (value === null || value === undefined || value === '') return '';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';

    // Bulatkan terlebih dahulu jika decimals = 0
    const processedValue = decimals === 0 ? roundNumber(numValue, roundingMethod) : numValue;

    if (processedValue === null) return '';

    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(processedValue);

    return `${symbol} ${formatted}`;
};

/**
 * Advanced number formatter dengan semua opsi
 * @param value - Nilai angka
 * @param options - Opsi formatting lengkap
 * @returns String angka yang sudah diformat
 */
export const formatNumberAdvanced = (value: number | string | null | undefined, options: NumberFormatOptions = {}): string => {
    const {
        decimals = 0,
        roundingMethod = RoundingMethod.ROUND,
        thousandSeparator = false,
        locale = 'id-ID',
        currency = false,
        currencySymbol = 'Rp',
    } = options;

    if (value === null || value === undefined || value === '') return '';

    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';

    // Proses pembulatan
    let processedValue: number;
    if (decimals === 0) {
        const rounded = roundNumber(numValue, roundingMethod);
        if (rounded === null) return '';
        processedValue = rounded;
    } else {
        const multiplier = Math.pow(10, decimals);
        switch (roundingMethod) {
            case RoundingMethod.ROUND:
                processedValue = Math.round(numValue * multiplier) / multiplier;
                break;
            case RoundingMethod.FLOOR:
                processedValue = Math.floor(numValue * multiplier) / multiplier;
                break;
            case RoundingMethod.CEIL:
                processedValue = Math.ceil(numValue * multiplier) / multiplier;
                break;
            case RoundingMethod.TRUNC:
                processedValue = Math.trunc(numValue * multiplier) / multiplier;
                break;
            default:
                processedValue = Math.round(numValue * multiplier) / multiplier;
        }
    }

    // Format dengan opsi
    let formatted: string;
    if (thousandSeparator) {
        formatted = new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(processedValue);
    } else {
        formatted = processedValue.toFixed(decimals);
    }

    // Tambahkan currency jika diperlukan
    if (currency) {
        return `${currencySymbol} ${formatted}`;
    }

    return formatted;
};

/**
 * Utility untuk validasi angka
 * @param value - Nilai yang akan divalidasi
 * @returns true jika valid, false jika tidak
 */
export const isValidNumber = (value: number | string | null | undefined): boolean => {
    if (value === null || value === undefined || value === '') return false;

    const numValue = parseFloat(value.toString());
    return !isNaN(numValue) && isFinite(numValue);
};

/**
 * Pembulatan ke kelipatan tertentu
 * @param value - Nilai angka
 * @param multiple - Kelipatan yang diinginkan
 * @param method - Metode pembulatan
 * @returns Angka yang dibulatkan ke kelipatan terdekat
 */
export const roundToMultiple = (
    value: number | string | null | undefined,
    multiple: number,
    method: RoundingMethod = RoundingMethod.ROUND,
): number | null => {
    if (!isValidNumber(value) || multiple <= 0) return null;

    const numValue = parseFloat(value!.toString());
    const divided = numValue / multiple;

    let rounded: number;
    switch (method) {
        case RoundingMethod.ROUND:
            rounded = Math.round(divided);
            break;
        case RoundingMethod.FLOOR:
            rounded = Math.floor(divided);
            break;
        case RoundingMethod.CEIL:
            rounded = Math.ceil(divided);
            break;
        case RoundingMethod.TRUNC:
            rounded = Math.trunc(divided);
            break;
        default:
            rounded = Math.round(divided);
    }

    return rounded * multiple;
};
