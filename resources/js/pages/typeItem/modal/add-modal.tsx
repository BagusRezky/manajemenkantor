import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { TypeItem } from '@/types/typeItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryItem } from '@/types/categoryItem';
import { toast } from 'sonner';


type TypeItemFormData = Omit<TypeItem, 'id'>;

type TypeItemFormModalProps = {
    categoryItems: CategoryItem[];
};

export function TypeItemFormModal({ categoryItems }: TypeItemFormModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<TypeItemFormData>({
        id_category_item: '',
        kode_type_item: '',
        nama_type_item: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const upperCaseFields = ['kode_type_item', 'nama_type_item'];

        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/typeItems', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                toast.success('Type Item added successfully');
                setOpen(false);
                setFormData({
                    id_category_item: '',
                    kode_type_item: '',
                    nama_type_item: '',
                });
            },
            onError: () => {
                toast.error('Failed to add Type Item');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Type Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Type Item</DialogTitle>
                        <DialogDescription>Fill in the Type Item details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_type_item" className="text-right">
                                Kode Type Item
                            </Label>
                            <Input
                                id="kode_type_item"
                                name="kode_type_item"
                                value={formData.kode_type_item}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_type_item" className="text-right">
                                Nama Type Item
                            </Label>
                            <Input
                                id="nama_type_item"
                                name="nama_type_item"
                                value={formData.nama_type_item}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id_category_item" className="text-right">
                                Kategori Item
                            </Label>
                            <div className="col-span-3">
                                <Select value={formData.id_category_item} onValueChange={(value) => handleSelectChange('id_category_item', value)} required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryItems.map((categoryitem) => (
                                            <SelectItem key={categoryitem.id} value={String(categoryitem.id) } >
                                                {categoryitem.nama_category_item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
