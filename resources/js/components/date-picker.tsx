import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
    value?: Date | string;
    onChange?: (date: Date) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);

    // 🟢 Tambahkan efek sinkronisasi ini
    React.useEffect(() => {
        if (value) {
            const newDate = new Date(value);
            if (!isNaN(newDate.getTime())) {
                setDate(newDate);
            }
        } else {
            setDate(undefined);
        }
    }, [value]);

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            onChange?.(selectedDate);
            setOpen(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-full justify-between font-normal">
                        {date ? date.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto rounded-xl p-3 shadow-md">
                    <Calendar mode="single" selected={date} captionLayout="dropdown" onSelect={handleSelect} />
                </PopoverContent>
            </Popover>
        </div>
    );
}
