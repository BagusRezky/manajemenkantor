import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SelectInputProps = {
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export function SelectInput({ id, value, onChange, options, placeholder = 'Pilih opsi', disabled = false, className }: SelectInputProps) {
    // Handle perubahan nilai
    const handleValueChange = (newValue: string) => {
        // Memanggil onChange callback dengan parameter value
        onChange(newValue);
    };

    return (
        <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
            <SelectTrigger id={id} className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
