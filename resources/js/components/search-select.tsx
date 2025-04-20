import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

type SearchableSelectProps = {
    items: {
        key?: string;
        value: string;
        label: string;
    }[];
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    
};

export function SearchableSelect({
    items,
    value = '', // Default to empty string if undefined
    placeholder = 'Select an option',
    onChange,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedValue, setSelectedValue] = useState(value);

    // Update selected value when prop changes
    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    // Find the selected item
    const selectedItem = items.find((item) => item.value === selectedValue);

    // Filter items based on search text
    const filteredItems = items.filter((item) => item.label.toLowerCase().includes(searchText.toLowerCase()));

    // Handle selection change
    const handleSelect = (newValue: string) => {
        setSelectedValue(newValue);
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            {/* Trigger button */}
            <Button type="button" className="flex w-full justify-between" variant="outline" onClick={() => setIsOpen(!isOpen)}>
                <span className="truncate">{selectedItem ? selectedItem.label : placeholder}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border shadow-lg bg-popover">
                    {/* Search box */}
                    <div className="border-b p-2">
                        <input
                            type="text"
                            className="w-full rounded-md border px-3 py-2 "
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Items list */}
                    <div className="max-h-60 overflow-auto">
                        {filteredItems.length === 0 ? (
                            <div className="p-2 text-center text-gray-500">No results found</div>
                        ) : (
                            <div>
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.key || item.value}
                                        className={`flex cursor-pointer items-center px-3 py-2 hover:bg-accent ${
                                            selectedValue === item.value ? 'bg-gray-20' : ''
                                        }`}
                                        onClick={() => handleSelect(item.value)}
                                    >
                                        <span>{item.label}</span>
                                        {selectedValue === item.value && <Check className="ml-auto h-4 w-4" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
