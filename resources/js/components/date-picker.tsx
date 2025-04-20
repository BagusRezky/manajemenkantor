import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

type DatePickerProps = {
    id: string;
    value: string | Date | undefined;
    onChange: (event: { target: { id: string; value: string | null } }) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
};

export function DatePicker({ id, value, onChange, placeholder = 'Pilih tanggal', className, disabled = false }: DatePickerProps) {
    // Konversi string tanggal ke objek Date jika ada
    const date = value ? new Date(value) : undefined;

    // Handle perubahan tanggal
    const handleSelect = (selectedDate: Date | undefined) => {
        // Format tanggal ke YYYY-MM-DD untuk penggunaan di backend
        const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

        // Panggil fungsi onChange dengan format event-like untuk kompatibilitas
        onChange({
            target: {
                id: id,
                value: formattedDate,
            },
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !date && 'text-gray-500', className)}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'yyyy-MM-dd') : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
            </PopoverContent>
        </Popover>
    );
}
