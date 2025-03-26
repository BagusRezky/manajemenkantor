import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export type Unit = {
    id: string;
    kode_satuan: string;
    nama_satuan: string;
};

type UnitFormData = Omit<Unit, 'id'>;

export function UnitFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<UnitFormData>({
        kode_satuan: '',
        nama_satuan: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/units', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                setOpen(false);
                setFormData({
                    kode_satuan: '',
                    nama_satuan: '',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Unit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Unit</DialogTitle>
                        <DialogDescription>Fill in the Unit details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_satuan" className="text-right">
                                Kode Unit
                            </Label>
                            <Input
                                id="kode_satuan"
                                name="kode_satuan"
                                value={formData.kode_satuan}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_satuan" className="text-right">
                                Nama Unit
                            </Label>
                            <Input
                                id="nama_satuan"
                                name="nama_satuan"
                                value={formData.nama_satuan}
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
