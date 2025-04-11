import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Departemen } from '@/types/departemen';



type DepartemenFormData = Omit<Departemen, 'id'>;

export function DepartemenFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<DepartemenFormData>({
        kode_departemen: '',
        nama_departemen: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const upperCaseFields = ['kode_departemen', 'nama_departemen'];

        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/departemens', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                setOpen(false);
                setFormData({
                    kode_departemen: '',
                    nama_departemen: '',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Departemen</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Departemen</DialogTitle>
                        <DialogDescription>Fill in the departemen item details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_departemen" className="text-right">
                                Kode Departemen
                            </Label>
                            <Input
                                id="kode_departemen"
                                name="kode_departemen"
                                value={formData.kode_departemen}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_departemen" className="text-right">
                                Nama Departemen
                            </Label>
                            <Input
                                id="nama_departemen"
                                name="nama_departemen"
                                value={formData.nama_departemen}
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
