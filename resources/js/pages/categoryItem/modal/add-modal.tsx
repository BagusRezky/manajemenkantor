import { CategoryItem } from '@/types/categoryItem';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type CategoryItemFormData = Omit<CategoryItem, 'id'>;

export function CategoryItemFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CategoryItemFormData>({
        kode_category_item: '',
        nama_category_item: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const upperCaseFields = ['kode_category_item', 'nama_category_item'];

        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/categoryItems', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                setOpen(false);
                setFormData({
                    kode_category_item: '',
                    nama_category_item: '',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Item Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Item Category</DialogTitle>
                        <DialogDescription>Fill in the category item details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_category_item" className="text-right">
                                Kode Item Category
                            </Label>
                            <Input
                                id="kode_category_item"
                                name="kode_category_item"
                                value={formData.kode_category_item}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_category_item" className="text-right">
                                Nama Category
                            </Label>
                            <Input
                                id="nama_category_item"
                                name="nama_category_item"
                                value={formData.nama_category_item}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
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
