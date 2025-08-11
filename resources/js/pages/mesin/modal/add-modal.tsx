import { Mesin } from '@/types/mesin';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type MesinFormData = Omit<Mesin, 'id'>;

export function MesinFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<MesinFormData>({
        nama_mesin: '',
        jenis_mesin: '',
        kapasitas: 0,
        proses: '',
        status: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const upperCaseFields = ['kode_satuan', 'nama_mesin'];
        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/mesins', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                toast.success('Mesin added successfully');
                setOpen(false);
                setFormData({
                    nama_mesin: '',
                    jenis_mesin: '',
                    kapasitas: 0,
                    proses: '',
                    status: '',
                });
            },
            onError: () => {
                toast.error('Failed to add Mesin');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Mesin</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Mesin</DialogTitle>
                        <DialogDescription>Fill in the Mesin details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_mesin" className="text-right">
                                Nama Mesin
                            </Label>
                            <Input
                                id="nama_mesin"
                                name="nama_mesin"
                                value={formData.nama_mesin}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jenis_mesin" className="text-right">
                                Jenis Mesin
                            </Label>
                            <Input
                                id="jenis_mesin"
                                name="jenis_mesin"
                                value={formData.jenis_mesin}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kapasitas" className="text-right">
                                Kapasitas
                            </Label>
                            <Input
                                id="kapasitas"
                                name="kapasitas"
                                type="number"
                                value={formData.kapasitas}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="proses" className="text-right">
                                Proses
                            </Label>
                            <Input id="proses" name="proses" value={formData.proses} onChange={handleChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Input id="status" name="status" value={formData.status} onChange={handleChange} className="col-span-3" required />
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
