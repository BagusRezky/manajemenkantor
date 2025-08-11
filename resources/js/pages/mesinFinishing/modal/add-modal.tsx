import { MesinFinishing } from '@/types/mesinFinishing';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type MesinFormData = Omit<MesinFinishing, 'id'>;

export function MesinFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<MesinFormData>({
        nama_mesin_finishing: '',
        jenis_mesin_finishing: '',
        kapasitas_finishing: 0,
        proses_finishing: '',
        status_finishing: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const upperCaseFields = ['kode_satuan', 'nama_mesin_finishing'];
        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/mesinFinishings', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                toast.success('Mesin added successfully');
                setOpen(false);
                setFormData({
                    nama_mesin_finishing: '',
                    jenis_mesin_finishing: '',
                    kapasitas_finishing: 0,
                    proses_finishing: '',
                    status_finishing: '',
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
                            <Label htmlFor="nama_mesin_finishing" className="text-right">
                                Nama Mesin
                            </Label>
                            <Input
                                id="nama_mesin_finishing"
                                name="nama_mesin_finishing"
                                value={formData.nama_mesin_finishing}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jenis_mesin_finishing" className="text-right">
                                Jenis Mesin
                            </Label>
                            <Input
                                id="jenis_mesin_finishing"
                                name="jenis_mesin_finishing"
                                value={formData.jenis_mesin_finishing}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kapasitas_finishing" className="text-right">
                                Kapasitas
                            </Label>
                            <Input
                                id="kapasitas_finishing"
                                name="kapasitas_finishing"
                                type="number"
                                value={formData.kapasitas_finishing}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="proses_finishing" className="text-right">
                                Proses
                            </Label>
                            <Input
                                id="proses_finishing"
                                name="proses_finishing"
                                value={formData.proses_finishing}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status_finishing" className="text-right">
                                Status
                            </Label>
                            <Input
                                id="status_finishing"
                                name="status_finishing"
                                value={formData.status_finishing}
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
