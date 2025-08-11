import { MesinDiemaking } from '@/types/mesinDiemaking';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type MesinFormData = Omit<MesinDiemaking, 'id'>;

export function MesinFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<MesinFormData>({
        nama_mesin_diemaking: '',
        jenis_mesin_diemaking: '',
        kapasitas_diemaking: 0,
        proses_diemaking: '',
        status_diemaking: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const upperCaseFields = ['kode_satuan', 'nama_mesin_diemaking'];
        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/mesinDiemakings', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                toast.success('Mesin added successfully');
                setOpen(false);
                setFormData({
                    nama_mesin_diemaking: '',
                    jenis_mesin_diemaking: '',
                    kapasitas_diemaking: 0,
                    proses_diemaking: '',
                    status_diemaking: '',
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
                            <Label htmlFor="nama_mesin_diemaking" className="text-right">
                                Nama Mesin
                            </Label>
                            <Input
                                id="nama_mesin_diemaking"
                                name="nama_mesin_diemaking"
                                value={formData.nama_mesin_diemaking}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jenis_mesin_diemaking" className="text-right">
                                Jenis Mesin
                            </Label>
                            <Input
                                id="jenis_mesin_diemaking"
                                name="jenis_mesin_diemaking"
                                value={formData.jenis_mesin_diemaking}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kapasitas_diemaking" className="text-right">
                                Kapasitas
                            </Label>
                            <Input
                                id="kapasitas_diemaking"
                                name="kapasitas_diemaking"
                                type="number"
                                value={formData.kapasitas_diemaking}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="proses_diemaking" className="text-right">
                                Proses
                            </Label>
                            <Input
                                id="proses_diemaking"
                                name="proses_diemaking"
                                value={formData.proses_diemaking}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status_diemaking" className="text-right">
                                Status
                            </Label>
                            <Input
                                id="status_diemaking"
                                name="status_diemaking"
                                value={formData.status_diemaking}
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
